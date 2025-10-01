// MIM MVP Frontend Application

class MIMApp {
  constructor() {
    this.currentUser = this.getUser();
    this.currentPrompt = null;
    this.entries = [];
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.init();
  }

  generateSessionId() {
    return 'session_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  // Analytics tracking method
  async trackAction(actionType, actionData = {}) {
    if (!this.currentUser) return;

    try {
      await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: this.currentUser.id,
          session_id: this.sessionId,
          action_type: actionType,
          action_data: {
            ...actionData,
            session_duration: Date.now() - this.startTime,
            page_url: window.location.href
          }
        })
      });
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }

  init() {
    if (!this.currentUser) {
      this.showOnboarding();
    } else {
      this.showMainApp();
    }
  }

  getUser() {
    const userStr = localStorage.getItem('mim_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  setUser(user) {
    this.currentUser = user;
    localStorage.setItem('mim_user', JSON.stringify(user));
  }

  showOnboarding() {
    // Initialize onboarding state
    this.onboardingStep = 0;
    this.onboardingData = {};
    this.showOnboardingStep();
  }

  showOnboardingStep() {
    const app = document.getElementById('app');
    
    if (this.onboardingStep === 0) {
      // Lyla Introduction
      app.innerHTML = `
        <div class="text-center space-y-8">
          <div class="space-y-6">
            <!-- Lyla Avatar/Icon -->
            <div class="flex justify-center">
              <div class="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                <span class="text-3xl">🪞</span>
              </div>
            </div>
            
            <div class="space-y-3">
              <h1 class="text-3xl font-bold text-white">
                Hi there! I'm Lyla
              </h1>
              <p class="text-xl text-purple-300 font-medium">
                "Your Inner Mirror"
              </p>
              <p class="text-gray-300 text-lg max-w-md mx-auto">
                Your AI-powered companion for self-discovery and emotional growth
              </p>
            </div>
          </div>
          
          <div class="bg-gray-800 rounded-lg p-6 space-y-6 text-left">
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-purple-300 text-center">What to expect:</h3>
              <div class="space-y-3">
                <div class="flex items-start space-x-3">
                  <span class="text-purple-400 mt-1">💭</span>
                  <p class="text-gray-300">Daily personalized prompts for deep reflection</p>
                </div>
                <div class="flex items-start space-x-3">
                  <span class="text-blue-400 mt-1">🔍</span>
                  <p class="text-gray-300">AI insights that understand your unique patterns</p>
                </div>
                <div class="flex items-start space-x-3">
                  <span class="text-green-400 mt-1">🔒</span>
                  <p class="text-gray-300">Complete privacy - your thoughts stay yours</p>
                </div>
              </div>
            </div>
            
            <div class="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4">
              <p class="text-gray-300 text-center italic">
                "As your Inner Mirror, I'm here to help you see patterns, insights, and truths about yourself that might be hard to see alone. The more you share with me, the clearer your reflection becomes."
              </p>
              <p class="text-purple-300 text-center mt-3 font-medium">— Lyla</p>
            </div>
            
            <button 
              onclick="app.nextOnboardingStep()"
              class="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-md transition-all duration-200"
            >
              Nice to meet you, Lyla! Let's begin
            </button>
          </div>
        </div>
      `;
    } else if (this.onboardingStep === 1) {
      // Lyla asking for name
      app.innerHTML = `
        <div class="space-y-6">
          <div class="text-center space-y-4">
            <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
              <span class="text-2xl">🪞</span>
            </div>
            <div class="space-y-2">
              <h2 class="text-2xl font-bold text-white">What should I call you?</h2>
              <p class="text-gray-400">Let's start with something simple</p>
            </div>
          </div>
          
          <div class="bg-gray-800 rounded-lg p-6 space-y-6">
            <div class="bg-purple-900/20 border-l-4 border-purple-500 p-4">
              <p class="text-gray-300 italic">
                "I'd love to know your name so I can personalize our conversations. As your Inner Mirror, I want to make this journey feel personal and meaningful to you."
              </p>
              <p class="text-purple-300 text-sm mt-2">— Lyla</p>
            </div>
            
            <div class="space-y-4">
              <div>
                <label for="firstName" class="block text-sm font-medium text-gray-300 mb-2">
                  Your first name
                </label>
                <input 
                  type="text" 
                  id="firstName" 
                  placeholder="What should I call you?"
                  class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
              </div>
              <div>
                <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
                  Email (optional - just in case you need to recover your account)
                </label>
                <input 
                  type="email" 
                  id="email" 
                  placeholder="your@email.com"
                  class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
              </div>
            </div>
            
            <div class="flex space-x-3">
              <button 
                onclick="app.prevOnboardingStep()"
                class="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-200"
              >
                Back to Lyla
              </button>
              <button 
                onclick="app.nextOnboardingStep()"
                class="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-200"
              >
                Continue Our Journey
              </button>
            </div>
          </div>
        </div>
      `;
    } else if (this.onboardingStep === 2) {
      // Lyla asking about what brings them here
      const firstName = this.onboardingData.firstName || 'there';
      app.innerHTML = `
        <div class="space-y-6">
          <div class="text-center space-y-4">
            <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
              <span class="text-2xl">🪞</span>
            </div>
            <div class="space-y-2">
              <h2 class="text-2xl font-bold text-white">Hi ${firstName}! 👋</h2>
              <p class="text-gray-400">I'm so glad you're here</p>
            </div>
          </div>
          
          <div class="bg-gray-800 rounded-lg p-6 space-y-6">
            <div class="bg-purple-900/20 border-l-4 border-purple-500 p-4">
              <p class="text-gray-300 italic">
                "As your Inner Mirror, I want to understand what's happening in your life right now. What's drawing you to inner reflection? The more you share with me, the better I can help you see patterns and insights about yourself."
              </p>
              <p class="text-purple-300 text-sm mt-2">— Lyla</p>
            </div>
            
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-white">What brings you to this inner journey right now?</h3>
              <div class="space-y-2">
                ${[
                  { value: 'emotions', label: 'Understanding my emotions better', desc: 'I want to make sense of what I\'m feeling' },
                  { value: 'patterns', label: 'Breaking old patterns', desc: 'I notice I keep repeating the same cycles' },
                  { value: 'clarity', label: 'Finding clarity in decisions', desc: 'I need help seeing situations more clearly' },
                  { value: 'stress', label: 'Managing stress and overwhelm', desc: 'Life feels too intense right now' },
                  { value: 'discovery', label: 'General self-discovery', desc: 'I want to understand myself better' },
                  { value: 'changes', label: 'Processing life changes', desc: 'Something big is shifting in my life' }
                ].map(option => `
                  <label class="flex items-start space-x-3 p-3 bg-gray-700 rounded-md hover:bg-gray-600 cursor-pointer transition-colors">
                    <input type="radio" name="growthFocus" value="${option.value}" class="mt-1 text-purple-600">
                    <div>
                      <div class="text-white font-medium">${option.label}</div>
                      <div class="text-gray-400 text-sm">${option.desc}</div>
                    </div>
                  </label>
                `).join('')}
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                <span class="text-purple-400">✨</span> Tell me more about this, ${firstName}. What's happening in your life right now? I'd love to understand your specific situation... <span class="text-purple-400">(Required - minimum 75 words)</span>
              </label>
              <textarea 
                id="growthFocusExplanation"
                placeholder="Share what's really going on for you right now. What experiences, challenges, or feelings brought you here? Be as honest and specific as you feel comfortable - this helps me understand how to best support you..."
                class="w-full h-32 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                oninput="app.updateWordCount('growthFocusExplanation', 'growthFocusWordCount', 75)"
              ></textarea>
              <div id="growthFocusWordCount" class="text-sm text-gray-500 mt-1">0/75 words minimum</div>
            </div>
            
            <div class="flex space-x-3">
              <button 
                onclick="app.prevOnboardingStep()"
                class="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-200"
              >
                Back
              </button>
              <button 
                onclick="app.nextOnboardingStep()"
                id="nextBtn2"
                class="flex-1 bg-gray-500 text-gray-300 font-medium py-2 px-4 rounded-md cursor-not-allowed"
                disabled
              >
                Continue with Lyla
              </button>
            </div>
          </div>
        </div>
      `;
    } else if (this.onboardingStep === 3) {
      // Completion - start the app
      this.completeOnboarding();
    }
  }

  nextOnboardingStep() {
    // Validate current step before proceeding
    if (this.onboardingStep === 1) {
      const firstName = document.getElementById('firstName').value.trim();
      if (!firstName) {
        alert('Please tell Lyla your name so she can personalize your journey!');
        return;
      }
      this.onboardingData.firstName = firstName;
      this.onboardingData.email = document.getElementById('email').value.trim();
    } else if (this.onboardingStep === 2) {
      const growthFocus = document.querySelector('input[name="growthFocus"]:checked')?.value;
      const explanation = document.getElementById('growthFocusExplanation').value.trim();
      const wordCount = explanation.split(/\s+/).filter(word => word.length > 0).length;
      
      if (!growthFocus) {
        alert('Please let Lyla know what brings you here by selecting an option');
        return;
      }
      if (wordCount < 75) {
        alert(`Lyla would love to understand your situation better. Please share at least 75 words about what's happening in your life. Current: ${wordCount} words`);
        return;
      }
      
      this.onboardingData.growthFocus = growthFocus;
      this.onboardingData.growthFocusExplanation = explanation;
    }
    
    this.onboardingStep++;
    
    if (this.onboardingStep > 3) {
      this.completeOnboarding();
    } else {
      this.showOnboardingStep();
    }
  }
  
  prevOnboardingStep() {
    if (this.onboardingStep > 0) {
      this.onboardingStep--;
      this.showOnboardingStep();
    }
  }
  
  updateWordCount(textareaId, counterId, minWords) {
    const textarea = document.getElementById(textareaId);
    const counter = document.getElementById(counterId);
    const nextBtn = document.getElementById(`nextBtn${this.onboardingStep}`);
    
    if (!textarea || !counter) return;
    
    const text = textarea.value.trim();
    const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
    
    if (wordCount >= minWords) {
      counter.textContent = `${wordCount}/${minWords} words ✨ Perfect!`;
      counter.className = 'text-sm text-purple-400 mt-1';
      if (nextBtn) {
        nextBtn.className = 'flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-200';
        nextBtn.disabled = false;
      }
    } else {
      counter.textContent = `${wordCount}/${minWords} words minimum - Lyla wants to understand you better`;
      counter.className = 'text-sm text-gray-500 mt-1';
      if (nextBtn) {
        nextBtn.className = 'flex-1 bg-gray-500 text-gray-300 font-medium py-2 px-4 rounded-md cursor-not-allowed';
        nextBtn.disabled = true;
      }
    }
  }

  async completeOnboarding() {
    const { firstName, email } = this.onboardingData;

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          first_name: firstName, 
          email: email || null,
          onboarding_data: this.onboardingData
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        this.setUser({ 
          id: result.id, 
          first_name: firstName, 
          email,
          session_id: result.session_id,
          onboarding_data: this.onboardingData
        });
        this.sessionId = result.session_id;
        
        // Track comprehensive onboarding completion
        await this.trackAction('onboarding_completed', {
          first_name: firstName,
          has_email: !!email,
          onboarding_data: this.onboardingData
        });
        
        this.showMainApp();
      } else {
        alert(result.error || 'Failed to create account');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  }

  async showMainApp() {
    await this.loadTodaysPrompt();
    await this.loadEntries();
    
    // Track app access
    await this.trackAction('app_accessed', {
      return_user: true
    });
    
    const app = document.getElementById('app');
    const firstName = this.currentUser.first_name;
    
    app.innerHTML = `
      <div class="space-y-6">
        <!-- Header with Lyla -->
        <div class="text-center space-y-4">
          <div class="flex items-center justify-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
              <span class="text-lg">🪞</span>
            </div>
            <div>
              <h1 class="text-2xl font-bold">Good ${this.getTimeOfDay()}, ${firstName}</h1>
              <p class="text-gray-400 text-sm">Lyla is here to guide your reflection</p>
            </div>
          </div>
        </div>

        <!-- Today's Prompt -->
        <div class="bg-gray-800 rounded-lg p-6 space-y-4">
          <h2 class="text-lg font-semibold flex items-center">
            <span class="mr-2">💭</span>
            Today's Reflection
          </h2>
          <div class="bg-gray-700 rounded-md p-4">
            <p class="text-blue-200 italic">${this.currentPrompt?.prompt_text || 'Loading...'}</p>
          </div>
          <div>
            <textarea 
              id="entryText"
              placeholder="${firstName}, take your time... what comes up for you?"
              class="w-full h-32 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              onfocus="app.entryStartTime = Date.now(); app.trackAction('entry_started', {prompt_id: app.currentPrompt?.id})"
            ></textarea>
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-300">How are you feeling? (1-5)</label>
            <div class="flex space-x-2">
              ${[1,2,3,4,5].map(rating => `
                <button 
                  onclick="app.setMoodRating(${rating})"
                  id="mood-${rating}"
                  class="mood-btn flex-1 py-2 px-3 bg-gray-700 hover:bg-gray-600 rounded-md text-sm transition-colors"
                >
                  ${rating}
                </button>
              `).join('')}
            </div>
            <div id="selectedMood" class="text-sm text-gray-400"></div>
          </div>
          
          <button 
            onclick="app.saveEntry()"
            class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-200"
          >
            Save Reflection
          </button>
        </div>

        <!-- Navigation -->
        <div class="flex space-x-2">
          <button 
            onclick="app.showMainView()"
            class="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md font-medium text-sm"
          >
            Today
          </button>
          <button 
            onclick="app.showEntriesView()"
            class="flex-1 py-2 px-4 bg-gray-700 text-gray-300 rounded-md font-medium hover:bg-gray-600 transition-colors text-sm"
          >
            Vault (${this.entries.length})
          </button>
          <button 
            onclick="app.showAnalyticsView()"
            class="flex-1 py-2 px-4 bg-gray-700 text-gray-300 rounded-md font-medium hover:bg-gray-600 transition-colors text-sm"
          >
            Insights
          </button>
        </div>

        <!-- Entries View (hidden by default) -->
        <div id="entriesView" class="hidden space-y-4">
          <h2 class="text-xl font-semibold">Your Reflection Vault</h2>
          <div id="entriesList" class="space-y-3">
            ${this.renderEntries()}
          </div>
        </div>

        <!-- Analytics View (hidden by default) -->
        <div id="analyticsView" class="hidden space-y-4">
          <h2 class="text-xl font-semibold">Your Growth Insights</h2>
          <div id="analyticsContent" class="space-y-4">
            <div class="text-gray-400">Loading your insights...</div>
          </div>
        </div>
      </div>
    `;
  }

  getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  }

  async loadTodaysPrompt() {
    try {
      const url = `/api/prompt/today?user_id=${this.currentUser?.id}&session_id=${this.sessionId}`;
      const response = await fetch(url);
      this.currentPrompt = await response.json();
    } catch (error) {
      console.error('Failed to load prompt:', error);
    }
  }

  setMoodRating(rating) {
    this.selectedMood = rating;
    
    // Update UI
    for (let i = 1; i <= 5; i++) {
      const btn = document.getElementById(`mood-${i}`);
      if (btn) {
        btn.className = i === rating 
          ? 'mood-btn flex-1 py-2 px-3 bg-blue-600 text-white rounded-md text-sm transition-colors'
          : 'mood-btn flex-1 py-2 px-3 bg-gray-700 hover:bg-gray-600 rounded-md text-sm transition-colors';
      }
    }
    
    document.getElementById('selectedMood').textContent = `Mood: ${rating}/5`;
    
    // Track mood selection
    this.trackAction('mood_selected', { 
      rating: rating,
      prompt_id: this.currentPrompt?.id 
    });
  }

  async loadEntries() {
    try {
      const url = `/api/entries/${this.currentUser.id}?session_id=${this.sessionId}`;
      const response = await fetch(url);
      const result = await response.json();
      this.entries = result.results || [];
    } catch (error) {
      console.error('Failed to load entries:', error);
      this.entries = [];
    }
  }

  async saveEntry() {
    const entryText = document.getElementById('entryText').value.trim();
    const timeToWrite = Date.now() - this.entryStartTime;
    
    if (!entryText) {
      alert('Please write something before saving');
      return;
    }

    try {
      const response = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: this.currentUser.id,
          entry_text: entryText,
          prompt_id: this.currentPrompt?.id,
          mood_rating: this.selectedMood || null,
          session_id: this.sessionId
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        // Track successful entry save
        await this.trackAction('entry_saved', {
          entry_id: result.id,
          entry_length: entryText.length,
          word_count: entryText.split(/\s+/).length,
          time_to_write: timeToWrite,
          mood_rating: this.selectedMood,
          patterns_detected: result.patterns_detected
        });

        document.getElementById('entryText').value = '';
        this.selectedMood = null;
        document.getElementById('selectedMood').textContent = '';
        
        // Reset mood buttons
        for (let i = 1; i <= 5; i++) {
          const btn = document.getElementById(`mood-${i}`);
          if (btn) {
            btn.className = 'mood-btn flex-1 py-2 px-3 bg-gray-700 hover:bg-gray-600 rounded-md text-sm transition-colors';
          }
        }
        
        alert('Reflection saved! 🌟');
        await this.loadEntries();
        this.updateEntriesCount();
      } else {
        alert(result.error || 'Failed to save entry');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  }

  updateEntriesCount() {
    const button = document.querySelector('button[onclick="app.showEntriesView()"]');
    if (button) {
      button.textContent = `My Vault (${this.entries.length})`;
    }
  }

  showMainView() {
    document.getElementById('entriesView').classList.add('hidden');
    document.getElementById('analyticsView').classList.add('hidden');
    // Update button styles
    const buttons = document.querySelectorAll('div.flex button');
    buttons[0].className = 'flex-1 py-2 px-4 bg-blue-600 text-white rounded-md font-medium text-sm';
    buttons[1].className = 'flex-1 py-2 px-4 bg-gray-700 text-gray-300 rounded-md font-medium hover:bg-gray-600 transition-colors text-sm';
    buttons[2].className = 'flex-1 py-2 px-4 bg-gray-700 text-gray-300 rounded-md font-medium hover:bg-gray-600 transition-colors text-sm';
  }

  showEntriesView() {
    document.getElementById('entriesView').classList.remove('hidden');
    document.getElementById('analyticsView').classList.add('hidden');
    document.getElementById('entriesList').innerHTML = this.renderEntries();
    
    // Track vault access
    this.trackAction('vault_opened', {
      entries_count: this.entries.length
    });
    
    // Update button styles
    const buttons = document.querySelectorAll('div.flex button');
    buttons[0].className = 'flex-1 py-2 px-4 bg-gray-700 text-gray-300 rounded-md font-medium hover:bg-gray-600 transition-colors text-sm';
    buttons[1].className = 'flex-1 py-2 px-4 bg-blue-600 text-white rounded-md font-medium text-sm';
    buttons[2].className = 'flex-1 py-2 px-4 bg-gray-700 text-gray-300 rounded-md font-medium hover:bg-gray-600 transition-colors text-sm';
  }

  async showAnalyticsView() {
    document.getElementById('entriesView').classList.add('hidden');
    document.getElementById('analyticsView').classList.remove('hidden');
    
    // Track analytics access
    this.trackAction('analytics_opened');
    
    // Load analytics data
    await this.loadAnalytics();
    
    // Update button styles
    const buttons = document.querySelectorAll('div.flex button');
    buttons[0].className = 'flex-1 py-2 px-4 bg-gray-700 text-gray-300 rounded-md font-medium hover:bg-gray-600 transition-colors text-sm';
    buttons[1].className = 'flex-1 py-2 px-4 bg-gray-700 text-gray-300 rounded-md font-medium hover:bg-gray-600 transition-colors text-sm';
    buttons[2].className = 'flex-1 py-2 px-4 bg-blue-600 text-white rounded-md font-medium text-sm';
  }

  async loadAnalytics() {
    try {
      const response = await fetch(`/api/analytics/${this.currentUser.id}`);
      const analytics = await response.json();
      
      document.getElementById('analyticsContent').innerHTML = this.renderAnalytics(analytics);
    } catch (error) {
      console.error('Failed to load analytics:', error);
      document.getElementById('analyticsContent').innerHTML = `
        <div class="text-red-400">Failed to load analytics. Please try again.</div>
      `;
    }
  }

  renderAnalytics(analytics) {
    const { patterns, moodTrend, activity } = analytics;
    
    return `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <!-- Activity Summary -->
        <div class="bg-gray-800 rounded-lg p-4">
          <h3 class="text-lg font-semibold mb-3 text-blue-400">Your Journey</h3>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-400">Total Reflections:</span>
              <span class="text-white font-medium">${activity?.total_entries || 0}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">Days Active:</span>
              <span class="text-white font-medium">${activity?.days_active || 0}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">Avg Entry Length:</span>
              <span class="text-white font-medium">${Math.round(activity?.avg_entry_length || 0)} chars</span>
            </div>
          </div>
        </div>

        <!-- Mood Trends -->
        ${moodTrend ? `
        <div class="bg-gray-800 rounded-lg p-4">
          <h3 class="text-lg font-semibold mb-3 text-green-400">Mood Insights</h3>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-400">Average Mood:</span>
              <span class="text-white font-medium">${moodTrend.averageMood?.toFixed(1) || 'N/A'}/5</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">Recent Trend:</span>
              <span class="text-white font-medium ${moodTrend.isImproving ? 'text-green-400' : 'text-yellow-400'}">
                ${moodTrend.isImproving ? '📈 Improving' : '📊 Stable'}
              </span>
            </div>
          </div>
        </div>
        ` : ''}

        <!-- Emotional Patterns -->
        ${patterns?.length > 0 ? `
        <div class="bg-gray-800 rounded-lg p-4 md:col-span-2">
          <h3 class="text-lg font-semibold mb-3 text-purple-400">Emotional Patterns</h3>
          <div class="space-y-3">
            ${patterns.map(pattern => {
              if (pattern.pattern_type === 'emotional_words') {
                const data = JSON.parse(pattern.pattern_data);
                const words = Object.entries(data).sort(([,a], [,b]) => b - a).slice(0, 6);
                return `
                  <div>
                    <h4 class="text-sm font-medium text-gray-300 mb-2">Most Used Emotional Words:</h4>
                    <div class="flex flex-wrap gap-2">
                      ${words.map(([word, count]) => `
                        <span class="bg-purple-600 bg-opacity-30 text-purple-200 px-2 py-1 rounded text-sm">
                          ${word} (${count})
                        </span>
                      `).join('')}
                    </div>
                  </div>
                `;
              }
              return '';
            }).join('')}
          </div>
        </div>
        ` : ''}

        <!-- Growth Encouragement -->
        <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 md:col-span-2">
          <h3 class="text-lg font-semibold mb-2 text-white">Keep Growing! 🌱</h3>
          <p class="text-blue-100">
            You're building something beautiful - a deeper relationship with yourself. 
            Every reflection is a step toward breaking cycles and living more authentically.
          </p>
        </div>
      </div>
    `;
  }

  renderEntries() {
    if (this.entries.length === 0) {
      return '<div class="text-gray-400 text-center py-8">No reflections yet. Start your journey above! ✨</div>';
    }

    return this.entries.map(entry => `
      <div class="bg-gray-800 rounded-lg p-4 space-y-2">
        <div class="flex justify-between items-start">
          <div class="text-sm text-gray-400">
            ${new Date(entry.created_at).toLocaleDateString()}
          </div>
          ${entry.mood_rating ? `
            <div class="text-sm bg-blue-600 text-white px-2 py-1 rounded">
              Mood: ${entry.mood_rating}/5
            </div>
          ` : ''}
        </div>
        ${entry.prompt_text ? `
          <div class="text-blue-200 text-sm italic">
            "${entry.prompt_text}"
          </div>
        ` : ''}
        <div class="text-gray-200">
          ${entry.entry_text.length > 200 ? 
            entry.entry_text.substring(0, 200) + '...' : 
            entry.entry_text
          }
        </div>
      </div>
    `).join('');
  }
}

// Initialize the app
const app = new MIMApp();