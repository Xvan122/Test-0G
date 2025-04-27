markdown
# 0G Testnet Swap Bot 🤖

[![GitHub stars](https://img.shields.io/github/stars/Xvan122/Test-0G?style=social)](https://github.com/Xvan122/Test-0G/stargazers)

Advanced swapping bot with one-click copy commands for easy setup.

## 🚀 Quick Installation

```bash
# Copy-paste these commands one by one:
<div align="left">
1. Clone Repository
bash
git clone https://github.com/Xvan122/Test-0G.git
<button onclick="navigator.clipboard.writeText('git clone https://github.com/Xvan122/Test-0G.git')">Copy</button>

2. Enter Directory
bash
cd Test-0G
<button onclick="navigator.clipboard.writeText('cd Test-0G')">Copy</button>

3. Install Dependencies
bash
npm install
<button onclick="navigator.clipboard.writeText('npm install')">Copy</button>

4. Setup Environment
bash
echo "PRIVATE_KEY=your_wallet_private_key" > .env
<button onclick="navigator.clipboard.writeText('echo "PRIVATE_KEY=your_wallet_private_key" > .env')">Copy</button>

5. Run Bot
bash
node bot.js
<button onclick="navigator.clipboard.writeText('node bot.js')">Copy</button>

</div>
🎮 Usage Modes
Manual Swap Looping
1. Select pair → Set amount → Unlimited swaps

Auto Random Swap
2. Fully automated random swaps

⚠️ Security Notice
Never share your .env file

Use only testnet wallets

Monitor balances regularly

<details> <summary>📚 Full Documentation</summary>
Advanced Configuration
Edit config in bot.js:

javascript
{
  swapInterval: 5000, // 5 seconds
  slippage: 2 // 2%
}
Support
Join our Telegram Group

</details> ```
To make the copy buttons work, you'll need to:

Create a new file docs/index.html with this content:

html
<!DOCTYPE html>
<html>
<head>
    <title>0G Swap Bot</title>
    <style>
        button {
            margin-left: 10px;
            padding: 2px 8px;
            background: #2ea44f;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        button:hover {
            background: #22863a;
        }
        pre {
            display: inline-block;
            background: #f6f8fa;
            padding: 8px;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <!-- Paste the README content here -->
</body>
</html>
Add this JavaScript to enable the copy functionality:

javascript
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function() {
        const codeBlock = this.previousElementSibling;
        const textToCopy = codeBlock.textContent.replace('bash\n', '').trim();
        navigator.clipboard.writeText(textToCopy);
        
        // Visual feedback
        const originalText = this.textContent;
        this.textContent = 'Copied!';
        setTimeout(() => {
            this.textContent = originalText;
        }, 2000);
    });
});
Alternative GitHub-friendly version (without JS buttons):

markdown
# 0G Testnet Swap Bot 🤖

## One-Click Commands

1. **Clone Repository**  
   ```bash
   git clone https://github.com/Xvan122/Test-0G.git
[Copy](javascript:navigator.clipboard.writeText('git clone https://github.com/Xvan122/Test-0G.git'))

Install Dependencies

bash
cd Test-0G && npm install
[Copy](javascript:navigator.clipboard.writeText('cd Test-0G && npm install'))

Run Bot

bash
node bot.js
[Copy](javascript:navigator.clipboard.writeText('node bot.js'))


Note: GitHub Markdown doesn't support JavaScript, so the buttons will only work:
- On your project's GitHub Pages site
- When viewed in a browser with the HTML wrapper
- Through browser extensions like "Enhanced GitHub"
