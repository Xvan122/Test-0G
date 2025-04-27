const fs = require('fs');
const readline = require('readline');
require('dotenv').config();
const { ethers } = require('ethers');

// Konfigurasi
const config = {
  network: {
    name: '0G-Galileo-Testnet',
    chainId: 80087,
    rpcUrl: 'https://evmrpc-testnet.0g.ai',
    explorer: 'https://chainscan-galileo.0g.ai'
  },
  contracts: {
    swapRouter: '0x16a811adc55A99b4456F62c54F12D3561559a268',
    tokens: {
      USDT: '0xA8F030218d7c26869CADd46C5F10129E635cD565',
      BTC: '0x6dc29491a8396Bd52376b4f6dA1f3E889C16cA85',
      ETH: '0x2619090fcfDB99a8CCF51c76C9467F7375040eeb'
    }
  },
  wallet: {
    privateKey: process.env.PRIVATE_KEY
  },
  swapParams: {
    fee: 100,
    slippage: 2,
    swapInterval: 5000 // 5 detik
  },
  randomAmount: {
    USDT: { min: 1, max: 10 },
    BTC: { min: 0.0001, max: 0.01 },
    ETH: { min: 0.0001, max: 0.01 }
  }
};

// ABIs
const ERC20_ABI = [
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function balanceOf(address account) external view returns (uint256)',
  'function decimals() external view returns (uint8)',
  'function symbol() external view returns (string)'
];

const SWAP_ROUTER_ABI = [
  'function exactInputSingle(tuple(address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 deadline, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96)) external returns (uint256)'
];

// Fungsi utilitas
function displayASCII() {
  console.log(`
     ██╗ ██████╗     █████╗ ██╗██████╗ ██████╗ ██████╗  ██████╗ ██████╗ 
     ██║██╔════╝    ██╔══██╗██║██╔══██╗██╔══██╗██╔══██╗██╔═══██╗██╔══██╗
     ██║██║         ███████║██║██████╔╝██║  ██║██████╔╝██║   ██║██████╔╝
██   ██║██║         ██╔══██║██║██╔══██╗██║  ██║██╔══██╗██║   ██║██╔═══╝ 
╚█████╔╝╚██████╗    ██║  ██║██║██║  ██║██████╔╝██║  ██║╚██████╔╝██║     
 ╚════╝  ╚═════╝    ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═╝     
`);
  console.log(`
 █████╗ ██╗     ██╗    ██╗ █████╗ ██╗   ██╗███████╗    ██████╗ ██╗   ██╗ ██████╗ ██████╗ 
██╔══██╗██║     ██║    ██║██╔══██╗╚██╗ ██╔╝██╔════╝    ██╔══██╗╚██╗ ██╔╝██╔═══██╗██╔══██╗
███████║██║     ██║ █╗ ██║███████║ ╚████╔╝ ███████╗    ██║  ██║ ╚████╔╝ ██║   ██║██████╔╝
██╔══██║██║     ██║███╗██║██╔══██║  ╚██╔╝  ╚════██║    ██║  ██║  ╚██╔╝  ██║   ██║██╔══██╗
██║  ██║███████╗╚███╔███╔╝██║  ██║   ██║   ███████║    ██████╔╝   ██║   ╚██████╔╝██║  ██║
╚═╝  ╚═╝╚══════╝ ╚══╝╚══╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝    ╚═════╝    ╚═╝    ╚═════╝ ╚═╝  ╚═╝
`);
console.log("Join My Chanel : https://t.me/JCAirdrops\n");
}

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

async function getUserInput(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer);
    });
  });
}

async function approveToken(wallet, tokenAddress, routerAddress) {
  const token = new ethers.Contract(tokenAddress, ERC20_ABI, wallet);
  try {
    const tx = await token.approve(routerAddress, ethers.MaxUint256);
    await tx.wait();
    console.log(`✅ Approved ${await token.symbol()}`);
  } catch (error) {
    console.error(`❌ Approval failed for ${await token.symbol()}: ${error.message}`);
  }
}

async function performSwap(wallet, router, fromToken, toToken, amountIn, fromSymbol, toSymbol) {
  try {
    const params = {
      tokenIn: fromToken.target,
      tokenOut: toToken.target,
      fee: config.swapParams.fee,
      recipient: wallet.address,
      deadline: Math.floor(Date.now() / 1000) + 600,
      amountIn,
      amountOutMinimum: 0,
      sqrtPriceLimitX96: 0
    };

    console.log(`🔄 Swapping ${ethers.formatUnits(amountIn, await fromToken.decimals())} ${fromSymbol} -> ${toSymbol}...`);
    const tx = await router.exactInputSingle(params, { gasLimit: 500000 });
    const receipt = await tx.wait();
    console.log(`✅ Swap success! TX: ${config.network.explorer}/tx/${receipt.hash}`);
    return true;
  } catch (error) {
    console.error(`❌ Swap failed: ${error.message}`);
    return false;
  }
}

// Mode Manual Swap dengan Looping Unlimited
// ... (kode sebelumnya tetap sama)

async function manualSwapLoop(wallet, tokens, router) {
    while (true) {
      console.log('\n=== MANUAL SWAP ===');
      console.log('1. USDT');
      console.log('2. BTC');
      console.log('3. ETH');
      console.log('0. Kembali ke menu utama');
      
      const from = await getUserInput('Pilih token asal (1-3, 0 untuk kembali): ');
      if (from === '0') break;
      
      const to = await getUserInput('Pilih token tujuan (1-3): ');
      
      const symbols = ['USDT', 'BTC', 'ETH'];
      const fromSymbol = symbols[parseInt(from) - 1];
      const toSymbol = symbols[parseInt(to) - 1];
      
      if (!fromSymbol || !toSymbol || fromSymbol === toSymbol) {
        console.log('Pilihan tidak valid');
        continue;
      }
  
      // TAMBAHKAN INPUT JUMLAH SEKALI SAJA SEBELUM LOOP
      const amount = await getUserInput(`Jumlah ${fromSymbol} yang akan di-swap setiap loop: `);
      
      // LOOPING UNLIMITED UNTUK PAIR YANG DIPILIH
      let swapCount = 0;
      console.log(`\n🚀 MEMULAI MANUAL SWAP LOOP: ${fromSymbol} -> ${toSymbol} 🚀`);
      
      while (true) {
        try {
          const amountIn = ethers.parseUnits(amount, await tokens[fromSymbol].decimals());
          const balance = await tokens[fromSymbol].balanceOf(wallet.address);
          
          if (balance < amountIn) {
            console.log(`❌ Saldo ${fromSymbol} tidak mencukupi`);
            break;
          }
          
          const success = await performSwap(wallet, router, tokens[fromSymbol], tokens[toSymbol], amountIn, fromSymbol, toSymbol);
          swapCount++;
          console.log(`♻️ Total swaps untuk ${fromSymbol}->${toSymbol}: ${swapCount}`);
          
          // TAMBAHKAN KONFIRMASI UNTUK BERHENTI
          if (swapCount % 5 === 0) {
            const stop = await getUserInput('Lanjutkan looping? (y/n): ');
            if (stop.toLowerCase() !== 'y') {
              break;
            }
          }
          
          await new Promise(res => setTimeout(res, config.swapParams.swapInterval));
        } catch (error) {
          console.error(`❌ Error: ${error.message}`);
          break;
        }
      }
    }
  }
  
async function randomSwapLoop(wallet, tokens, router) {
  let swapCount = 0;
  console.log('\n🚀 MEMULAI AUTO RANDOM SWAP (UNLIMITED LOOP) 🚀');
  
  while (true) {
    const symbols = ['USDT', 'BTC', 'ETH'];
    const fromIdx = Math.floor(Math.random() * 3);
    let toIdx;
    do {
      toIdx = Math.floor(Math.random() * 3);
    } while (toIdx === fromIdx);
    
    const fromSymbol = symbols[fromIdx];
    const toSymbol = symbols[toIdx];
    const range = config.randomAmount[fromSymbol];
    const amount = randomInRange(range.min, range.max);
    
    try {
      const amountIn = ethers.parseUnits(amount.toFixed(6), await tokens[fromSymbol].decimals());
      const balance = await tokens[fromSymbol].balanceOf(wallet.address);
      
      if (balance < amountIn) {
        console.log(`❌ Saldo ${fromSymbol} tidak mencukupi, mencari pair lain...`);
        await new Promise(res => setTimeout(res, config.swapParams.swapInterval));
        continue;
      }
      
      await performSwap(wallet, router, tokens[fromSymbol], tokens[toSymbol], amountIn, fromSymbol, toSymbol);
      swapCount++;
      console.log(`♻️ Total swaps: ${swapCount}`);
      
      await new Promise(res => setTimeout(res, config.swapParams.swapInterval));
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
    }
  }
}

// Menu Utama
async function main() {
  displayASCII();
  
  const provider = new ethers.JsonRpcProvider(config.network.rpcUrl);
  const wallet = new ethers.Wallet(config.wallet.privateKey, provider);

  console.log(`Connected to ${config.network.name}`);
  console.log(`Wallet: ${wallet.address}\n`);

  // Inisialisasi kontrak
  const tokens = {
    USDT: new ethers.Contract(config.contracts.tokens.USDT, ERC20_ABI, wallet),
    BTC: new ethers.Contract(config.contracts.tokens.BTC, ERC20_ABI, wallet),
    ETH: new ethers.Contract(config.contracts.tokens.ETH, ERC20_ABI, wallet)
  };
  const router = new ethers.Contract(config.contracts.swapRouter, SWAP_ROUTER_ABI, wallet);

  // Approve semua token
  console.log('\nMenyiapkan approval token...');
  for (const [symbol, token] of Object.entries(tokens)) {
    await approveToken(wallet, token.target, router.target);
  }

  // Menu utama
  while (true) {
    console.log('\n=== MENU UTAMA ===');
    console.log('1. Manual Swap (Looping Unlimited)');
    console.log('2. Auto Random Swap (Looping Unlimited)');
    console.log('3. Cek Balance');
    console.log('0. Keluar');
    
    const choice = await getUserInput('Pilih menu: ');

    if (choice === '1') {
      await manualSwapLoop(wallet, tokens, router);
    } else if (choice === '2') {
      await randomSwapLoop(wallet, tokens, router);
    } else if (choice === '3') {
      console.log('\n=== BALANCE ===');
      for (const [symbol, token] of Object.entries(tokens)) {
        const balance = await token.balanceOf(wallet.address);
        console.log(`${symbol}: ${ethers.formatUnits(balance, await token.decimals())}`);
      }
      console.log(`Native: ${ethers.formatEther(await provider.getBalance(wallet.address))}`);
    } else if (choice === '0') {
      console.log('Keluar dari program...');
      process.exit(0);
    } else {
      console.log('Pilihan tidak valid');
    }
  }
}

main().catch(console.error);
