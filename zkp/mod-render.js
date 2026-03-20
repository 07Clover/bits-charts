const DIFF_LABELS  = { easy:"EASY", normal:"NORMAL", hard:"HARD", erect:"ERECT" };
const DIFF_CLASSES = { easy:"diff-easy", normal:"diff-normal", hard:"diff-hard", erect:"diff-erect" };

function badge(d) {
    return `<span class="diff-badge ${DIFF_CLASSES[d]}">${DIFF_LABELS[d]}</span>`;
}

function renderMod(modId) {
    const MOD = MODS_DATA.find(m => m.id === modId);
    if (!MOD) {
        document.getElementById('mod-root').innerHTML = `<h1 style="color:red;text-align:center;padding:100px;">Mod "${modId}" not found</h1>`;
        return;
    }

    document.title = `Bit's Charts | ${MOD.name}`;

    const banner = MOD.banner
        ? `<img src="${MOD.banner}" alt="${MOD.name}" loading="lazy">`
        : `<div class="mod-banner-placeholder">[ ADD BANNER ]</div>`;

    const diffBadges = (MOD.diffs || []).map(badge).join(' ');

    const videos = (MOD.videos || []).map(v => `
        <div class="mod-video-wrap">
            <iframe src="https://www.youtube.com/embed/${v.id}" title="${v.label}"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            <div class="video-label">&gt; ${v.label}</div>
        </div>
    `).join('');

    const songRows = (MOD.songs || []).map(s => `
        <tr>
            <td style="color:var(--text-body);opacity:0.5;">${s.num}</td>
            <td>${s.name}</td>
            <td>${(s.diffs || []).map(badge).join(' ')}</td>
            <td><span class="bpm-val">${s.bpm}</span></td>
        </tr>
    `).join('');

    const songSection = songRows ? `
        <div class="mod-section">
            <span class="mod-section-label cyan">Song List</span>
            <table class="song-table">
                <thead><tr><th>#</th><th>Song Name</th><th>Difficulty</th><th>BPM</th></tr></thead>
                <tbody>${songRows}</tbody>
            </table>
        </div>` : '';

    const creditsRows = (MOD.credits || []).map(c => {
        const people = (c.people || []).map(p => `
            <div class="credit-person">
                <span class="credit-name">${p.name}</span>
                ${p.detail ? `<span class="credit-detail">— ${p.detail}</span>` : ''}
            </div>
        `).join('');
        return `
            <div class="credit-row">
                <div class="credit-role-label"><span>${c.icon}</span><span>${c.role}</span></div>
                <div class="credit-people">${people}</div>
            </div>`;
    }).join('');

    const creditsSection = creditsRows ? `
        <div class="mod-section">
            <span class="mod-section-label green">Credits</span>
            <div class="credits-list">${creditsRows}</div>
        </div>` : '';

    const dlButtons = (MOD.downloads || []).filter(d => d.href).map(d => `
        <a href="${d.href}" class="download-btn ${d.style === 'secondary' ? 'secondary' : ''}" target="_blank">${d.label}</a>
    `).join('');

    // Fix banner path — mods-data.js uses "img/..." but mod pages are inside mods/
    const bannerFixed = banner.replace(/src="img\//g, 'src="../img/');

    document.getElementById('mod-root').innerHTML = `
        <div class="mod-banner">${bannerFixed}<div class="mod-banner-overlay"></div>
            <div class="mod-banner-title">
                <h1>${MOD.name}</h1>
                <div class="mod-banner-meta">
                    <span>By ${MOD.author}</span>
                    <span>${MOD.engine}</span>
                    <span>${MOD.released}</span>
                    ${diffBadges}
                </div>
            </div>
        </div>
        <div class="container">
            <a href="../mods.html" class="back-link">&lt;&lt; Back to All Mods</a>
            <div class="mod-layout">
                <div class="mod-main">
                    ${videos}
                    <div class="mod-section"><span class="mod-section-label">Description</span><p>${MOD.description}</p></div>
                    ${songSection}
                    ${creditsSection}
                </div>
                <div class="mod-sidebar">
                    <div class="sidebar-box">
                        <div class="sidebar-box-label">&gt; Download</div>
                        <div class="sidebar-box-body">${dlButtons}</div>
                    </div>
                    <div class="sidebar-box">
                        <div class="sidebar-box-label">&gt; Mod Info</div>
                        <div class="sidebar-box-body">
                            <p><strong>Charter</strong><br>${MOD.author}</p>
                            <p><strong>Engine</strong><br>${MOD.engine}</p>
                            <p><strong>Songs</strong><br>${(MOD.songs || []).length}</p>
                            <p><strong>Released</strong><br>${MOD.released}</p>
                            <p><strong>Version</strong><br>${MOD.version}</p>
                        </div>
                    </div>
                    <div class="sidebar-box" style="border-color:var(--primary);">
                        <div class="sidebar-box-label" style="background:var(--primary);color:var(--white);">&gt; HEEEYY BRO</div>
                        <div class="sidebar-box-body" style="text-align:center;">
                            <p style="font-family:'SSS',monospace;color:var(--white);font-size:0.85rem;margin-bottom:0.8rem;line-height:1.6;">ples donate 🙏</p>
                            <a href="https://www.paypal.com/paypalme/JoseCaceres170dp" class="download-btn" target="_blank" style="background:var(--score-green);color:var(--black);">&gt;&gt; PayPal Donate</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
}
