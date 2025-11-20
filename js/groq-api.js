// Groq AI API Integration
class GroqAPI {
    constructor() {
        // API Key'i buraya ekleyin: https://console.groq.com/
        this.apiKey = 'gsk_YOUR_NEW_GROQ_API_KEY_HERE'; // Yeni API key gerekli
        this.baseURL = 'https://api.groq.com/openai/v1/chat/completions';
        this.model = 'llama-3.1-70b-versatile'; // Primary model
        this.fallbackModels = ['mixtral-8x7b-32768', 'llama-3.1-8b-instant'];
        this.lastRequestTime = 0;
        this.minRequestInterval = 1000; // 1 second between requests (Groq is faster)
        
        // Test API key on initialization
        this.testAPIKey();
    }
    
    async testAPIKey() {
        try {
            console.log('🔑 Groq API key test ediliyor...');
            const testResponse = await fetch(this.baseURL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [{ role: 'user', content: 'Test' }],
                    max_tokens: 10
                })
            });
            
            if (testResponse.ok) {
                console.log('✅ Groq API key geçerli!');
            } else {
                const testErrorText = await testResponse.text();
                console.error('❌ Groq API key test hatası:', testResponse.status, testErrorText);
            }
        } catch (error) {
            console.error('❌ Groq API key test hatası:', error);
        }
    }
    
    async generateContent(prompt, context = '', retryCount = 0) {
        try {
            // Rate limiting: wait if needed
            const now = Date.now();
            const timeSinceLastRequest = now - this.lastRequestTime;
            if (timeSinceLastRequest < this.minRequestInterval) {
                await new Promise(resolve => setTimeout(resolve, this.minRequestInterval - timeSinceLastRequest));
            }
            
            const fullPrompt = context ? `${context}\n\n${prompt}` : prompt;
            
            const requestBody = {
                model: this.model,
                messages: [
                    {
                        role: 'user',
                        content: fullPrompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 2048
            };
            
            this.lastRequestTime = Date.now();
            
            const response = await fetch(this.baseURL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });
            
            if (!response.ok) {
                // Enhanced error logging
                const errorText = await response.text();
                console.error(`❌ Groq API Hatası (${response.status}):`, errorText);
                
                // Handle rate limit (429)
                if (response.status === 429) {
                    if (retryCount < 3) {
                        const waitTime = Math.pow(2, retryCount) * 1000;
                        console.warn(`⚠️ Rate limit hit, retrying in ${waitTime/1000} seconds... (${retryCount + 1}/3)`);
                        await new Promise(resolve => setTimeout(resolve, waitTime));
                        return this.generateContent(prompt, context, retryCount + 1);
                    } else {
                        throw new Error('Rate limit: Çok fazla istek gönderildi. Lütfen birkaç dakika sonra tekrar deneyin.');
                    }
                }
                
                // Handle 404 or other errors - try fallback models
                if ((response.status === 404 || response.status >= 500) && retryCount < this.fallbackModels.length) {
                    console.warn(`⚠️ Model hatası, alternatif model deneniyor... (${retryCount + 1}/${this.fallbackModels.length})`);
                    const originalModel = this.model;
                    this.model = this.fallbackModels[retryCount];
                    const result = await this.generateContent(prompt, context, retryCount + 1);
                    this.model = originalModel; // Restore original
                    return result;
                }
                
                const apiErrorText = await response.text().catch(() => '');
                console.error(`❌ API Hatası (${response.status}):`, apiErrorText);
                throw new Error(`Groq API error: ${response.status} - ${apiErrorText.substring(0, 100)}`);
            }
            
            const data = await response.json();
            
            // Log response for debugging
            console.log('📥 Groq API yanıtı:', data);
            
            if (data.choices && data.choices[0] && data.choices[0].message) {
                const text = data.choices[0].message.content;
                if (text) {
                    return {
                        success: true,
                        text: text
                    };
                }
                throw new Error('API yanıtında metin bulunamadı');
            } else {
                console.error('❌ Geçersiz API yanıtı yapısı:', data);
                throw new Error('Geçersiz API yanıtı: choices veya message bulunamadı');
            }
            
        } catch (error) {
            console.error('❌ Groq API hatası:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    // Siber güvenlik eğitimi için özel promptlar
    async generateSecurityAdvice(situation) {
        const context = `Sen bir siber güvenlik uzmanısın. Öğrencilere bilgi güvenliği konusunda tavsiyelerde bulunuyorsun. Türkçe yanıt ver.`;
        const prompt = `Bu durumda siber güvenlik prensiplerini kullanarak nasıl hareket etmeliyim: ${situation}`;
        
        return await this.generateContent(prompt, context);
    }
    
    async generateQuizQuestion(topic, difficulty = 'orta') {
        const context = `Sen bir eğitim uzmanısın. Öğrenciler için anlaşılır, öğretici ve kaliteli test soruları hazırlıyorsun.

KURALLAR:
- Türkçe dilbilgisi kurallarına uy
- Net ve açık sorular sor
- Şıklar birbirinden farklı olsun
- Gerçek bilgiye dayalı sorular sor
- Sadece JSON döndür, başka açıklama yapma`;
        
        const randomSeed = Math.floor(Math.random() * 1000);
        
        const prompt = `Konu: "${topic}"
Zorluk: ${difficulty}
Çeşitlilik: ${randomSeed}

Bir çoktan seçmeli soru oluştur (4 şık).

SADECE ŞU JSON FORMATINI DÖNDÜR:
{
    "question": "Soru metni buraya",
    "options": ["A şıkkı", "B şıkkı", "C şıkkı", "D şıkkı"],
    "correctAnswer": 0,
    "explanation": "Kısa açıklama"
}

SADECE JSON, BAŞKA HİÇBİR ŞEY YAZMA!`;
        
        const result = await this.generateContent(prompt, context);
        
        if (result.success) {
            try {
                // Clean response
                let cleanText = result.text.trim();
                cleanText = cleanText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
                
                const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const data = JSON.parse(jsonMatch[0]);
                    
                    if (data.question && Array.isArray(data.options) && data.options.length === 4) {
                        return [{
                            question: data.question,
                            options: data.options,
                            correctAnswer: data.correctAnswer || data.correct || 0,
                            difficulty: difficulty,
                            explanation: data.explanation || ''
                        }];
                    }
                }
            } catch (error) {
                console.error('❌ Soru parse hatası:', error);
            }
        }
        
        return [];
    }
    
    async generateModuleSummary(moduleContent) {
        const context = `Sen bir eğitim içeriği uzmanısın. Siber güvenlik modüllerinin özetlerini hazırlıyorsun. Türkçe yanıt ver.`;
        const prompt = `Bu modül içeriğinin özetini hazırla: ${moduleContent}`;
        
        return await this.generateContent(prompt, context);
    }
    
    async generatePersonalizedFeedback(userProgress, completedModules) {
        const context = `Sen bir siber güvenlik koçusun. Öğrencilerin ilerlemesine göre kişiselleştirilmiş geri bildirimler veriyorsun. Türkçe yanıt ver.`;
        const prompt = `Kullanıcının genel ilerlemesi: %${userProgress}, tamamladığı modüller: ${completedModules.join(', ')}. Bu bilgilere göre kişiselleştirilmiş bir geri bildirim ve gelişim önerileri hazırla.`;
        
        return await this.generateContent(prompt, context);
    }
    
    // YENİ: Yanlış cevaplara göre kişiselleştirilmiş video önerisi
    async generateVideoRecommendation(wrongQuestion, wrongAnswer, correctAnswer, allModules, allVideos) {
        // Check if API key is valid
        if (!this.apiKey || this.apiKey.includes('YOUR_NEW_GROQ_API_KEY_HERE')) {
            console.warn('⚠️ Groq API key bulunamadı, fallback cevap kullanılıyor');
            return this.getFallbackRecommendation(wrongQuestion, wrongAnswer, correctAnswer);
        }
        
        try {
            const context = `Sen bir eğitim danışmanısın. Öğrencilerin yanlış cevapladığı sorulara göre hangi videoları izlemeleri gerektiğini öneriyorsun. Türkçe yanıt ver.`;
            
            // Ensure arrays are valid
            const modules = Array.isArray(allModules) ? allModules : [];
            const videos = Array.isArray(allVideos) ? allVideos : [];
            
            const modulesInfo = modules.length > 0 
                ? modules.map(m => `- ${m.title || 'İsimsiz Modül'}: ${m.description || 'Açıklama yok'}`).join('\n')
                : 'Henüz modül eklenmemiş.';
            
            const videosInfo = videos.length > 0
                ? videos.map(v => {
                    const videoId = v.id || v.youtubeVideoId || 'bilinmeyen';
                    const videoTitle = v.title || 'İsimsiz Video';
                    const moduleId = v.moduleId || 'bilinmeyen';
                    const description = v.description || 'Açıklama yok';
                    return `- ${videoTitle} (ID: ${videoId}, Modül: ${moduleId}): ${description}`;
                }).join('\n')
                : 'Henüz video eklenmemiş.';
        
            const prompt = `
Öğrenci şu soruyu yanlış cevapladı:
Soru: ${wrongQuestion}
Öğrencinin Cevabı: ${wrongAnswer}
Doğru Cevap: ${correctAnswer}

Sistemdeki Modüller:
${modulesInfo}

Sistemdeki Videolar:
${videosInfo}

Bu konuyu öğrenmesi için hangi videoyu izlemeli? Mevcut videolardan birini öner.

SADECE ŞU JSON FORMATINI DÖNDÜR:
{
    "feedback": "Kısa ve motive edici geri bildirim (2-3 cümle)",
    "recommendedVideoId": "video_id_buraya",
    "recommendedVideoTitle": "video_başlığı_buraya",
    "reason": "Bu videoyu neden izlemeli (1 cümle)"
}

SADECE JSON DÖNDÜR!`;
            
            const result = await this.generateContent(prompt, context);
            
            // Check for errors first
            if (!result.success || result.error) {
                return {
                    success: false,
                    error: result.error || 'API hatası',
                    feedback: result.error && result.error.includes('Rate limit') 
                        ? 'API limit aşıldı. Lütfen birkaç dakika sonra tekrar deneyin.'
                        : 'Bu konuyu tekrar gözden geçirmenizi öneririz.',
                    recommendedVideoId: videos.length > 0 ? (videos[0].id || videos[0].youtubeVideoId) : null,
                    recommendedVideoTitle: videos.length > 0 ? videos[0].title : null,
                    reason: ''
                };
            }
            
            if (result.success && result.text) {
                try {
                    let cleanText = result.text.trim();
                    cleanText = cleanText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
                    
                    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                        const data = JSON.parse(jsonMatch[0]);
                        
                        // Try to find the recommended video in the actual videos array
                        let actualVideoId = null;
                        let actualVideoTitle = null;
                        
                        if (data.recommendedVideoId && videos.length > 0) {
                            const foundVideo = videos.find(v => 
                                (v.id === data.recommendedVideoId) || 
                                (v.youtubeVideoId === data.recommendedVideoId) ||
                                (v.title && v.title.toLowerCase().includes(data.recommendedVideoTitle?.toLowerCase() || ''))
                            );
                            
                            if (foundVideo) {
                                actualVideoId = foundVideo.id || foundVideo.youtubeVideoId;
                                actualVideoTitle = foundVideo.title;
                            }
                        }
                        
                        // If no match found, use first available video
                        if (!actualVideoId && videos.length > 0) {
                            const firstVideo = videos[0];
                            actualVideoId = firstVideo.id || firstVideo.youtubeVideoId;
                            actualVideoTitle = firstVideo.title;
                        }
                        
                        return {
                            success: true,
                            feedback: data.feedback || 'Bu konuyu tekrar gözden geçirmenizi öneririz.',
                            recommendedVideoId: actualVideoId || data.recommendedVideoId || null,
                            recommendedVideoTitle: actualVideoTitle || data.recommendedVideoTitle || null,
                            reason: data.reason || ''
                        };
                    }
                } catch (error) {
                    console.error('❌ Video önerisi parse hatası:', error);
                    console.error('API yanıtı:', result.text);
                }
            }
            
            return {
                success: false,
                feedback: 'Bu konuyu tekrar gözden geçirmenizi öneririz. İlgili videoları izleyerek konuyu pekiştirebilirsiniz.',
                recommendedVideoId: videos.length > 0 ? (videos[0].id || videos[0].youtubeVideoId) : null,
                recommendedVideoTitle: videos.length > 0 ? videos[0].title : null,
                reason: ''
            };
        } catch (error) {
            console.error('❌ generateVideoRecommendation hatası:', error);
            return this.getFallbackRecommendation(wrongQuestion, wrongAnswer, correctAnswer);
        }
    }
    
    getFallbackRecommendation(wrongQuestion, wrongAnswer, correctAnswer) {
        const recommendations = [
            {
                success: true,
                feedback: `❌ Yanlış cevap: "${wrongAnswer}"\n✅ Doğru cevap: "${correctAnswer}"\n\n💡 Bu konuyu daha iyi anlamak için videoyu tekrar izleyin ve önemli noktaları not alın.`,
                recommendedVideoId: null,
                recommendedVideoTitle: 'Mevcut Video',
                reason: 'Konuyu pekiştirmek için'
            },
            {
                success: true,
                feedback: `🎯 Doğru cevap "${correctAnswer}" idi.\n\n📚 İlgili video bölümünü tekrar izleyin ve benzer sorularla pratik yapın.`,
                recommendedVideoId: null,
                recommendedVideoTitle: 'Mevcut Video',
                reason: 'Pratik yapmak için'
            },
            {
                success: true,
                feedback: `⚠️ "${correctAnswer}" doğru cevaptı.\n\n🔄 Videoyu dikkatlice tekrar izleyin ve ana kavramları not alın.`,
                recommendedVideoId: null,
                recommendedVideoTitle: 'Mevcut Video',
                reason: 'Kavramları pekiştirmek için'
            }
        ];
        
        return recommendations[Math.floor(Math.random() * recommendations.length)];
    }
}

// Initialize Groq API globally
window.GroqAPI = new GroqAPI();
// Keep GeminiAPI for backward compatibility (will be removed later)
window.GeminiAPI = window.GroqAPI;
console.log('✅ Groq API entegrasyonu hazır!');

