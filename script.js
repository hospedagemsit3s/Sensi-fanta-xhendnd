const sensiData = {
    "Nobru": { "Balanceada": { "Geral": "107", "Red Dot": "125", "Mira 2x": "100", "Mira 4x": "106", "AWM / Sniper": "114", "Olhadinha": "125" } },
    "Fantasma": { "Balanceada": { "Geral": "197", "Red Dot": "199", "Mira 2x": "200", "Mira 4x": "180", "AWM / Sniper": "167", "Olhadinha": "194" } }
};

document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    const homeGridHTML = document.getElementById('home-grid').outerHTML;

    // Router
    window.addEventListener('hashchange', handleRoute);
    handleRoute();

    function handleRoute() {
        const hash = window.location.hash || '#home';
        mainContent.style.opacity = '0';
        
        setTimeout(() => {
            if (hash === '#home') {
                mainContent.innerHTML = homeGridHTML;
                attachHomeListeners();
            } else if (hash === '#sensi-famosos') {
                renderSensiFamosos();
            } else if (hash === '#gerar-sensi') {
                renderGerarSensi();
            } else if (hash === '#sensi-arma') {
                renderSensiArma();
            } else if (hash === '#dpi-android') {
                renderDPI();
            } else if (hash === '#ciclos-iphone') {
                renderCiclos();
            } else if (hash === '#favoritos') {
                renderFavoritos();
            }
            mainContent.style.opacity = '1';
            window.scrollTo(0, 0);
        }, 150);
    }

    function attachHomeListeners() {
        document.querySelectorAll('[data-page]').forEach(link => {
            link.onclick = (e) => {
                e.preventDefault();
                window.location.hash = link.getAttribute('data-page');
            };
        });
    }

    function renderSensiFamosos() {
        mainContent.innerHTML = `
            <div class="animate-slide-up space-y-6">
                <div class="flex items-center gap-4">
                    <a href="#home" class="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-orange-500 hover:border-orange-500 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path></svg>
                    </a>
                    <div>
                        <h2 class="text-xl font-bold">Sensi dos Famosos</h2>
                        <p class="text-zinc-500 text-sm">Configurações inspiradas nos pros</p>
                    </div>
                </div>

                <div class="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-6 space-y-6">
                    <div class="space-y-3">
                        <label class="text-zinc-400 text-sm font-semibold">Qual famoso?</label>
                        <div class="relative">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 w-4 h-4"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
                            <input type="text" id="famoso-input" placeholder="Digite o nome do pro player..." class="w-full bg-black/40 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-zinc-600 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/10 outline-none transition-all">
                        </div>
                        <div class="flex flex-wrap gap-2 pt-2">
                            ${['Nobru', 'Fantasma', 'Two9', 'Marechal', 'Freitas', 'Bak'].map(f => `<button class="chip px-4 py-2 rounded-xl bg-zinc-900/80 border border-zinc-800/50 text-zinc-500 text-xs font-medium hover:border-orange-500/30 transition-all">${f}</button>`).join('')}
                        </div>
                    </div>

                    <div class="space-y-3">
                        <label class="text-zinc-400 text-sm font-semibold">O que você quer priorizar?</label>
                        <div class="grid grid-cols-2 gap-2">
                            ${['Balanceada', 'Mais capa', 'Mais controle', 'Muito rápida'].map(s => `<button class="style-btn p-4 rounded-xl bg-zinc-900/80 border border-zinc-800/50 text-zinc-500 text-sm font-bold hover:border-orange-500/30 transition-all ${s === 'Balanceada' ? 'style-btn-active' : ''}">${s}</button>`).join('')}
                        </div>
                    </div>
                </div>

                <button id="btn-gerar" class="relative w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-black font-black rounded-xl text-lg shadow-[0_0_20px_rgba(255,107,0,0.3)] active:scale-95 transition-all flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path><path d="M20 3v4"></path><path d="M22 5h-4"></path></svg>
                    Gerar Sensi
                </button>

                <div id="result-container"></div>
            </div>
        `;
        setupInternalEvents();
    }

    function setupInternalEvents() {
        // Chip selection
        document.querySelectorAll('.chip').forEach(chip => {
            chip.onclick = () => {
                document.querySelectorAll('.chip').forEach(c => c.classList.remove('chip-active'));
                chip.classList.add('chip-active');
                const input = document.getElementById('famoso-input');
                if (input) input.value = chip.textContent;
            };
        });

        // Style selection
        document.querySelectorAll('.style-btn').forEach(btn => {
            btn.onclick = () => {
                document.querySelectorAll('.style-btn').forEach(b => b.classList.remove('style-btn-active'));
                btn.classList.add('style-btn-active');
            };
        });

        // Generate button
        const btnGerar = document.getElementById('btn-gerar');
        if (btnGerar) {
            btnGerar.onclick = () => {
                btnGerar.disabled = true;
                btnGerar.innerHTML = `<svg class="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Gerando...`;
                
                setTimeout(() => {
                    const famoso = document.getElementById('famoso-input')?.value || "Nobru";
                    const estilo = document.querySelector('.style-btn-active')?.textContent || "Balanceada";
                    const data = (sensiData[famoso] && sensiData[famoso][estilo]) || generateRandomSensi();
                    showResult(famoso, estilo, data);
                    btnGerar.disabled = false;
                    btnGerar.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path><path d="M20 3v4"></path><path d="M22 5h-4"></path></svg> Gerar Sensi`;
                }, 800);
            };
        }
    }

    function generateRandomSensi() {
        return {
            "Geral": Math.floor(150 + Math.random() * 50),
            "Red Dot": Math.floor(150 + Math.random() * 50),
            "Mira 2x": Math.floor(150 + Math.random() * 50),
            "Mira 4x": Math.floor(150 + Math.random() * 50),
            "AWM / Sniper": Math.floor(80 + Math.random() * 40),
            "Olhadinha": Math.floor(150 + Math.random() * 50)
        };
    }

    function showResult(nome, estilo, data) {
        const container = document.getElementById('result-container');
        container.innerHTML = `
            <div class="animate-slide-up bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-6 space-y-6">
                <div class="text-center">
                    <h3 class="text-xl font-black text-orange-500">${nome}</h3>
                    <p class="text-zinc-500 text-xs font-bold uppercase tracking-widest">${estilo}</p>
                </div>
                <div class="bg-black/30 rounded-xl border border-zinc-800/30 overflow-hidden">
                    ${Object.entries(data).map(([label, val]) => `
                        <div class="flex justify-between items-center p-4 border-b border-zinc-800/20 last:border-0">
                            <span class="text-zinc-400 font-medium">${label}</span>
                            <span class="text-orange-500 font-black text-lg">${val}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <button class="py-3 rounded-xl bg-zinc-800/80 text-white font-bold text-sm hover:bg-zinc-700 transition-all">Salvar</button>
                    <button class="py-3 rounded-xl border border-zinc-800/50 text-zinc-400 font-bold text-sm hover:border-orange-500/30 transition-all">Copiar</button>
                </div>
            </div>
        `;
        container.scrollIntoView({ behavior: 'smooth' });
    }

    // Placeholder functions for other pages
    function renderGerarSensi() { renderSensiFamosos(); }
    function renderSensiArma() { renderSensiFamosos(); }
    function renderDPI() { renderSensiFamosos(); }
    function renderCiclos() { renderSensiFamosos(); }
    function renderFavoritos() { renderSensiFamosos(); }
});
