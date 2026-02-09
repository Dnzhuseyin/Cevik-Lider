
class GroqAPI {
    constructor() {
        console.log('GroqAPI constructor başlatılıyor...');
        console.log('Güvenli API Proxy kullanılıyor ');
        

        const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
        this.proxyURL = isProduction
            ? '/api/groq-proxy'
            : 'http://localhost:8000/api/groq-proxy';  
        this.model = 'llama-3.3-70b-versatile';
        console.log('✅ Model ayarlandı:', this.model);
        this.lastRequestTime = 0;
        this.minRequestInterval = 1000; 
        
        console.log('🔗 Proxy URL:', this.proxyURL);
        
        
        this.testAPIKey();
    }
    
    async testAPIKey() {
        try {
            console.log('Groq API proxy test ediliyor...');
            
            const testResponse = await fetch(this.proxyURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt: 'Test',
                    model: this.model,
                    max_tokens: 10
                })
            });
            
            if (testResponse.ok) {
                const data = await testResponse.json();
                console.log('✅ Groq API proxy çalışıyor!');
                console.log('✅ API bağlantısı başarılı');
            } else {
                const testErrorText = await testResponse.text();
                console.error('❌ Groq API proxy test hatası:', testResponse.status, testErrorText);
                console.warn('⚠️ Vercel API route kontrol edin: /api/groq-proxy');
            }
        } catch (error) {
            console.error('❌ Groq API proxy test hatası:', error);
            console.warn('⚠️ Vercel dev server çalışıyor mu? (vercel dev)');
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
            
            // Detaylı log
            console.log('🔍 API Request Detayları:');
            console.log('  - Proxy URL:', this.proxyURL);
            console.log('  - Model:', this.model);
            
            // Vercel API proxy kullan (API key backend'de güvenli)
            const response = await fetch(this.proxyURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt: fullPrompt,
                    context: context || '',
                    model: this.model, // Sadece llama-3.3-70b-versatile kullanılıyor
                    temperature: 0.7,
                    max_tokens: 2048
                })
            });
            
            if (!response.ok) {
                // Enhanced error logging
                const errorText = await response.text();
                console.error(`❌ Groq API Proxy Hatası (${response.status}):`, errorText);
                
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
                
                // Model hatası - fallback yok, direkt hata döndür
                if (response.status === 400 || response.status === 404) {
                    const errorData = await response.json().catch(() => ({}));
                    const errorMessage = errorData.message || errorData.error?.message || 'Model hatası';
                    console.error(`❌ Model hatası (${response.status}):`, errorMessage);
                    throw new Error(`Model hatası: ${errorMessage}`);
                }
                
                const apiErrorText = await response.text().catch(() => '');
                console.error(`❌ API Proxy Hatası (${response.status}):`, apiErrorText);
                throw new Error(`Groq API proxy error: ${response.status} - ${apiErrorText.substring(0, 100)}`);
            }
            
            const proxyResponse = await response.json();
            
            // Proxy response structure: { success: true, data: { ... } }
            if (!proxyResponse.success || !proxyResponse.data) {
                console.error('❌ Geçersiz proxy yanıtı:', proxyResponse);
                throw new Error('Geçersiz proxy yanıtı');
            }
            
            const data = proxyResponse.data;
            
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
    
    // AI özelliği: Sadece video önerisi (diğer özellikler devre dışı)
    
    // YENİ: Zaman damgası haritası yükle
    async loadTimestampMappings() {
        try {
            const response = await fetch('/data/timelines/question-timestamps.json');
            if (!response.ok) {
                console.warn('⚠️ Timestamp mappings yüklenemedi');
                return null;
            }
            return await response.json();
        } catch (error) {
            console.error('❌ Timestamp mappings yükleme hatası:', error);
            return null;
        }
    }

    // Soru konusuna göre timestamp bul
    findTimestampForQuestion(timestampData, questionTopic, questionType = 'multipleChoice') {
        if (!timestampData) {
            console.log('⚠️ timestampData null');
            return null;
        }

        console.log('🔎 Aranan soru konusu:', questionTopic);
        console.log('📝 Soru tipi:', questionType);

        let bestMatch = null;
        let bestScore = 0;

        // Tüm bölümleri tara
        for (const [bolumKey, bolumData] of Object.entries(timestampData)) {
            const questions = bolumData[questionType] || [];
            console.log(`📂 ${bolumKey} - ${questions.length} soru`);

            // Soru konusunu ara
            for (const q of questions) {
                const matchResult = this.matchQuestionTopic(questionTopic, q.topic);

                if (matchResult === true) {
                    console.log('✅ Tam eşleşme bulundu!', q.topic);
                    return {
                        timeRange: q.timeRange || q.timeRanges?.[0],
                        videoModule: bolumData.videoModule,
                        bolumKey: bolumKey
                    };
                } else if (typeof matchResult === 'number' && matchResult > bestScore) {
                    bestScore = matchResult;
                    bestMatch = {
                        timeRange: q.timeRange || q.timeRanges?.[0],
                        videoModule: bolumData.videoModule,
                        bolumKey: bolumKey,
                        topic: q.topic
                    };
                }
            }
        }

        if (bestMatch && bestScore >= 0.3) {
            console.log(`✅ En iyi eşleşme bulundu (skor: ${(bestScore * 100).toFixed(0)}%):`, bestMatch.topic);
            return bestMatch;
        }

        console.log('❌ Hiçbir bölümde yeterli eşleşme bulunamadı');
        return null;
    }

    // Soru konusu eşleştirme (fuzzy matching) - true veya skor döndürür
    matchQuestionTopic(userQuestion, mappedTopic) {
        const normalize = (str) => str.toLowerCase()
            .replace(/[çÇ]/g, 'c')
            .replace(/[ğĞ]/g, 'g')
            .replace(/[ıİ]/g, 'i')
            .replace(/[öÖ]/g, 'o')
            .replace(/[şŞ]/g, 's')
            .replace(/[üÜ]/g, 'u')
            .replace(/[^\w\s]/g, '')
            .trim();

        const normalizedQuestion = normalize(userQuestion);
        const normalizedTopic = normalize(mappedTopic);

        // Tam eşleşme
        if (normalizedQuestion.includes(normalizedTopic) || normalizedTopic.includes(normalizedQuestion)) {
            return true;
        }

        // Özel kelime eşleşmeleri (domain-specific keywords) - En yüksek öncelik
        const specialKeywords = [
            'oz yeterlik', 'psikolojik direnc', 'product backlog', 'kanban',
            'kolb', 'scrum', 'kvkk', 'tpack', 'samr', 'vuca', 'bani',
            'cynefin', 'scamper', 'mot', 'fast', 'okr', 'bsc', 'kpi',
            'wallas', 'drucker', 'bandura', 'etik liderlik', 'merkeziyetci',
            'degisim direnci', 'kurumsal surdurulebilirlik', 'yinelemeli',
            'product owner', 'psikososyal', 'simulasyon', 'role play',
            'kisa vadeli kazanim', 'orgutsel direnc', 'kulturel direnc',
            'cevik dusunce', 'sprint', 'hata yapma kulturu', 'ogrenme kulturu'
        ];

        for (const keyword of specialKeywords) {
            const normalizedKeyword = normalize(keyword);
            if (normalizedQuestion.includes(normalizedKeyword) && normalizedTopic.includes(normalizedKeyword)) {
                console.log(`🔑 Özel kelime eşleşmesi: "${keyword}"`);
                return true;
            }
        }

        // Anahtar kelime eşleşmesi (skor döndür)
        const questionWords = normalizedQuestion.split(/\s+/).filter(w => w.length > 2);
        const topicWords = normalizedTopic.split(/\s+/).filter(w => w.length > 2);

        if (questionWords.length === 0 || topicWords.length === 0) {
            return 0;
        }

        // Ortak kelimeleri bul
        const commonWords = questionWords.filter(w => topicWords.includes(w));
        const matchRatio = commonWords.length / Math.max(questionWords.length, topicWords.length);

        if (matchRatio >= 0.4) {
            console.log(`🎯 Eşleşme oranı: ${(matchRatio * 100).toFixed(0)}% - "${mappedTopic}"`);
            return true;
        }

        // Düşük skor döndür (en iyi eşleşme için)
        return matchRatio;
    }

    // YENİ: Yanlış cevaplara göre kişiselleştirilmiş video önerisi (TIMESTAMP DESTEĞİ İLE)
    async generateVideoRecommendation(wrongQuestion, wrongAnswer, correctAnswer, allModules, allVideos) {
        console.log('🔒 Güvenli API Proxy kullanılıyor (API key backend\'de)');
        console.log('🔗 Proxy URL:', this.proxyURL);

        try {
            // Timestamp haritasını yükle
            const timestampData = await this.loadTimestampMappings();

            // Soru için timestamp bul
            console.log('🔍 Timestamp arıyorum, soru:', wrongQuestion);
            const timestampMatch = this.findTimestampForQuestion(timestampData, wrongQuestion);

            if (timestampMatch) {
                console.log('✅ Timestamp bulundu:', timestampMatch);
            } else {
                console.log('⚠️ Bu soru için timestamp bulunamadı');
                console.log('📋 Yüklenen timestamp verisi var mı?', timestampData ? 'Evet' : 'Hayır');
                if (timestampData) {
                    console.log('📦 Toplam bölüm sayısı:', Object.keys(timestampData).length);
                }
            }

            const context = `Sen bir eğitim danışmanısın. Türkçe yanıt ver. Kısa ve net ol.`;

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
        
            // Timestamp bilgisini prompt'a ekle
            const timestampInfo = timestampMatch
                ? `\n\n🎯 ÖNEMLİ: Bu soru için özel zaman aralığı bulundu: ${timestampMatch.timeRange}\nÖğrenci videoyu ${timestampMatch.timeRange} bölümünden izlemelidir.`
                : '';

            const timestampField = timestampMatch ? `,"timestamp":"${timestampMatch.timeRange}"` : '';

            const prompt = `
Öğrenci yanlış cevap verdi:
Soru: ${wrongQuestion}
Yanlış Cevap: ${wrongAnswer}
Doğru Cevap: ${correctAnswer}
${timestampInfo}

Mevcut Videolar:
${videosInfo}

Öğrenciye hangi videoyu izlemesini önerirsiniz? Mevcut videolardan en uygununu seçin.
${timestampMatch ? `\nÖNEMLİ: Bu soru için özel zaman aralığı var: ${timestampMatch.timeRange}` : ''}

Sadece bu JSON formatında yanıt ver (reason alanında Türkçe olmayan kelime kullanma):
{"feedback":"Kısa motivasyon mesajı","recommendedVideoId":"video_id","recommendedVideoTitle":"video_başlığı","reason":"Neden bu video"${timestampField}}

SADECE GEÇERLİ JSON! Türkçe karakterler kullanabilirsin ama JSON formatı bozulmamalı.`;
            
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
                            reason: data.reason || '',
                            timestamp: timestampMatch ? timestampMatch.timeRange : (data.timestamp || null)
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
                reason: '',
                timestamp: timestampMatch ? timestampMatch.timeRange : null
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
// Keep GeminiAPI for backward compatibility (OpenRouter kaldırıldı)
window.GeminiAPI = window.GroqAPI;
console.log('✅ Groq API entegrasyonu hazır!');

