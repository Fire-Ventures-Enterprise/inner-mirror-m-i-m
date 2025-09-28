// MIM MVP Frontend Application

class MIMApp {
  constructor() {
    this.currentUser = this.getUser();
    this.currentPrompt = null;
    this.entries = [];
    this.init();
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
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="text-center space-y-8">
        <div class="space-y-4">
          <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Welcome to Your Inner Mirror
          </h1>
          <p class="text-gray-300 text-lg">
            A safe space for honest self-reflection and breaking emotional cycles.
          </p>
        </div>
        
        <div class="bg-gray-800 rounded-lg p-6 space-y-4">
          <h2 class="text-xl font-semibold">Let's get started</h2>
          <div>
            <label for="firstName" class="block text-sm font-medium text-gray-300 mb-2">
              What should we call you?
            </label>
            <input 
              type="text" 
              id="firstName" 
              placeholder="Enter your first name"
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          <div>
            <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
              Email (optional)
            </label>
            <input 
              type="email" 
              id="email" 
              placeholder="your@email.com"
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          <button 
            onclick="app.completeOnboarding()"
            class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-200"
          >
            Begin Your Journey
          </button>
        </div>
        
        <div class="text-sm text-gray-400 space-y-2">
          <p>🔒 Your entries are private and stored securely</p>
          <p>💭 Daily prompts to guide your reflection</p>
          <p>📱 Access your thoughts anytime, anywhere</p>
        </div>
      </div>
    `;
  }

  async completeOnboarding() {
    const firstName = document.getElementById('firstName').value.trim();
    const email = document.getElementById('email').value.trim();

    if (!firstName) {
      alert('Please enter your first name');
      return;
    }

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ first_name: firstName, email: email || null })
      });

      const result = await response.json();
      
      if (response.ok) {
        this.setUser({ id: result.id, first_name: firstName, email });
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
    
    const app = document.getElementById('app');
    const firstName = this.currentUser.first_name;
    
    app.innerHTML = `
      <div class="space-y-6">
        <!-- Header -->
        <div class="text-center space-y-2">
          <h1 class="text-2xl font-bold">Good ${this.getTimeOfDay()}, ${firstName}</h1>
          <p class="text-gray-400">Ready to look in your inner mirror?</p>
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
            ></textarea>
          </div>
          <button 
            onclick="app.saveEntry()"
            class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-200"
          >
            Save Reflection
          </button>
        </div>

        <!-- Navigation -->
        <div class="flex space-x-4">
          <button 
            onclick="app.showMainView()"
            class="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md font-medium"
          >
            Today
          </button>
          <button 
            onclick="app.showEntriesView()"
            class="flex-1 py-2 px-4 bg-gray-700 text-gray-300 rounded-md font-medium hover:bg-gray-600 transition-colors"
          >
            My Vault (${this.entries.length})
          </button>
        </div>

        <!-- Entries View (hidden by default) -->
        <div id="entriesView" class="hidden space-y-4">
          <h2 class="text-xl font-semibold">Your Reflection Vault</h2>
          <div id="entriesList" class="space-y-3">
            ${this.renderEntries()}
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
      const response = await fetch('/api/prompt/today');
      this.currentPrompt = await response.json();
    } catch (error) {
      console.error('Failed to load prompt:', error);
    }
  }

  async loadEntries() {
    try {
      const response = await fetch(`/api/entries/${this.currentUser.id}`);
      const result = await response.json();
      this.entries = result.results || [];
    } catch (error) {
      console.error('Failed to load entries:', error);
      this.entries = [];
    }
  }

  async saveEntry() {
    const entryText = document.getElementById('entryText').value.trim();
    
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
          prompt_id: this.currentPrompt?.id
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        document.getElementById('entryText').value = '';
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
    // Update button styles
    const buttons = document.querySelectorAll('div.flex button');
    buttons[0].className = 'flex-1 py-2 px-4 bg-blue-600 text-white rounded-md font-medium';
    buttons[1].className = 'flex-1 py-2 px-4 bg-gray-700 text-gray-300 rounded-md font-medium hover:bg-gray-600 transition-colors';
  }

  showEntriesView() {
    document.getElementById('entriesView').classList.remove('hidden');
    document.getElementById('entriesList').innerHTML = this.renderEntries();
    
    // Update button styles
    const buttons = document.querySelectorAll('div.flex button');
    buttons[0].className = 'flex-1 py-2 px-4 bg-gray-700 text-gray-300 rounded-md font-medium hover:bg-gray-600 transition-colors';
    buttons[1].className = 'flex-1 py-2 px-4 bg-blue-600 text-white rounded-md font-medium';
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