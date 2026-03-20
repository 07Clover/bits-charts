(function() {
    var style = document.createElement('style');
    style.textContent = `
        .pt-bar {
            position: fixed;
            left: 0;
            width: 100%;
            background: #000;
            z-index: 99999;
            pointer-events: none;
        }
        .pt-bar-top    { top: 0; height: 52%; }
        .pt-bar-bottom { bottom: 0; height: 52%; }
        .pt-bar.animating {
            transition: height 0.45s cubic-bezier(0.77, 0, 0.18, 1);
        }
    `;
    document.head.appendChild(style);

    var barTop = document.createElement('div');
    var barBot = document.createElement('div');
    barTop.className = 'pt-bar pt-bar-top';
    barBot.className = 'pt-bar pt-bar-bottom';

    function insertBars() {
        if (document.body) {
            document.body.insertBefore(barBot, document.body.firstChild);
            document.body.insertBefore(barTop, document.body.firstChild);
            openBars();
        } else {
            requestAnimationFrame(insertBars);
        }
    }

    function openBars() {
        requestAnimationFrame(function() {
            barTop.classList.add('animating');
            barBot.classList.add('animating');
            requestAnimationFrame(function() {
                barTop.style.height = '0%';
                barBot.style.height = '0%';
            });
        });
    }

    // Exponer globalmente para que onclick también lo use
    window.ptNavigate = function(href) {
        if (href.startsWith('http') || href.startsWith('#')) {
            window.location.href = href;
            return;
        }
        barTop.classList.add('animating');
        barBot.classList.add('animating');
        barTop.style.height = '52%';
        barBot.style.height = '52%';
        setTimeout(function() {
            window.location.href = href;
        }, 460);
    };

    // Interceptar links <a>
    document.addEventListener('click', function(e) {
        var link = e.target.closest('a');
        if (!link) return;
        var href = link.getAttribute('href');
        if (!href) return;
        if (href.startsWith('http') || href.startsWith('#') || href.startsWith('javascript') || href.startsWith('mailto')) return;
        if (link.target === '_blank') return;
        e.preventDefault();
        window.ptNavigate(href);
    });

    // Interceptar onclick con location.href
    document.addEventListener('click', function(e) {
        var el = e.target.closest('[onclick]');
        if (!el) return;
        var onclick = el.getAttribute('onclick');
        if (!onclick || !onclick.includes('location.href')) return;
        var match = onclick.match(/location\.href\s*=\s*['"]([^'"]+)['"]/);
        if (!match) return;
        var href = match[1];
        if (href.startsWith('http') || href.startsWith('#')) return;
        e.preventDefault();
        e.stopImmediatePropagation();
        window.ptNavigate(href);
    }, true);

    insertBars();
})();
