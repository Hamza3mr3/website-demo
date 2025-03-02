// Kod formatları
const codeFormats = {
    valorant: {
        pattern: 'VALO-XXXX-XXXX-XXXX',
        chars: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    },
    roblox: {
        pattern: 'RBX-XXXX-XXXX-XXXX',
        chars: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    },
    genshin: {
        pattern: 'GNSN-XXXX-XXXX-XXXX',
        chars: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    },
    fortnite: {
        pattern: 'FN-XXXX-XXXX-XXXX-XXXX',
        chars: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    },
    pubg: {
        pattern: 'PUBG-XXXX-XXXX-XXXX',
        chars: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    }
};

let isGenerating = false;
let totalCodesGenerated = 0;
let recentCodes = [];

// Aktif kullanıcı sayısını dinamik olarak güncelle
function updateActiveUsers() {
    const baseUsers = 500;
    const randomIncrease = Math.floor(Math.random() * 100);
    const currentUsers = baseUsers + randomIncrease;
    
    const element = document.getElementById('activeUsers');
    const currentValue = parseInt(element.textContent);
    const difference = currentUsers - currentValue;
    
    // Animasyonlu geçiş
    let step = difference / 20;
    let current = currentValue;
    
    const animation = setInterval(() => {
        if ((step > 0 && current >= currentUsers) || (step < 0 && current <= currentUsers)) {
            clearInterval(animation);
            element.textContent = currentUsers;
        } else {
            current += step;
            element.textContent = Math.round(current);
        }
    }, 50);
}

// Kod üretme fonksiyonu
function generateCode() {
    const type = document.querySelector('.service-item.active').dataset.service;
    const format = codeFormats[type];
    let code = '';

    for (let i = 0; i < format.pattern.length; i++) {
        if (format.pattern[i] === 'X') {
            code += format.chars.charAt(Math.floor(Math.random() * format.chars.length));
        } else {
            code += format.pattern[i];
        }
    }

    document.getElementById('codeOutput').value = code;
    return code;
}

// Kod üretme işlemini başlat
function startGenerator() {
    if (isGenerating) return;
    isGenerating = true;

    const generateBtn = document.getElementById('generateBtn');
    const loadingBar = document.getElementById('loadingBar');
    const progress = loadingBar.querySelector('.progress');
    const status = document.getElementById('status');

    generateBtn.disabled = true;
    loadingBar.style.display = 'block';
    progress.style.width = '0%';
    status.textContent = 'Kod üretiliyor...';

    let width = 0;
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            const generatedCode = generateCode();
            
            // İstatistikleri güncelle
            totalCodesGenerated++;
            document.getElementById('totalCodes').textContent = totalCodesGenerated;
            
            // Son kodları güncelle
            addToRecentCodes(generatedCode);
            
            generateBtn.disabled = false;
            loadingBar.style.display = 'none';
            status.textContent = 'Kod başarıyla üretildi!';
            status.style.color = '#4CAF50';
            isGenerating = false;
        } else {
            width += 2;
            progress.style.width = width + '%';
        }
    }, 50);
}

// Son üretilen kodları listele
function addToRecentCodes(code) {
    const codeList = document.getElementById('codeList');
    const activeService = document.querySelector('.service-item.active').dataset.service;
    
    // Servis isimlerini düzgün göster
    const serviceNames = {
        valorant: 'VALORANT',
        roblox: 'ROBLOX',
        genshin: 'GENSHIN IMPACT',
        fortnite: 'FORTNITE',
        pubg: 'PUBG MOBILE'
    };

    // Yeni kod öğesi oluştur
    const codeItem = document.createElement('div');
    codeItem.className = 'code-item';
    codeItem.innerHTML = `
        <span class="code-text">${code}</span>
        <span class="code-service">${serviceNames[activeService]}</span>
        <span class="code-time">${new Date().toLocaleTimeString()}</span>
    `;
    
    // Listeye ekle
    codeList.insertBefore(codeItem, codeList.firstChild);
    
    // Maksimum 5 kod göster
    if (codeList.children.length > 5) {
        codeList.removeChild(codeList.lastChild);
    }
}

// Kopyalama fonksiyonu
function copyCode() {
    const codeOutput = document.getElementById('codeOutput');
    codeOutput.select();
    document.execCommand('copy');
    
    const copyBtn = document.getElementById('copyBtn');
    copyBtn.innerHTML = '<i class="fas fa-check"></i>';
    setTimeout(() => {
        copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
    }, 2000);
}

// Servis seçimi
document.querySelectorAll('.service-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.service-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        
        const serviceName = item.querySelector('span').textContent;
        document.querySelector('.service-info h2').textContent = `${serviceName} Generator`;
        document.getElementById('codeOutput').value = '';
        document.getElementById('status').textContent = '';
    });
});

// Sayfa yüklendiğinde başlangıç değerlerini ayarla
window.onload = function() {
    document.getElementById('activeUsers').textContent = '500';
    setInterval(updateActiveUsers, 5000);
}; 