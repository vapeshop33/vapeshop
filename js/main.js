let cart = JSON.parse(localStorage.getItem('vapeCart')) || []
function saveCart() { localStorage.setItem('vapeCart', JSON.stringify(cart)); updateCartUI() }
function updateCartUI() {
    const count = cart.reduce((s, i) => s + i.qty, 0)
    document.querySelectorAll('.cart-count').forEach(el => el.textContent = count)
}
function toast(msg, type = 'success') {
    const t = document.createElement('div'); t.className = `toast toast--${type}`; t.textContent = msg
    document.body.appendChild(t); setTimeout(() => t.remove(), 2500)
}
function renderProducts(products, containerId) {
    const c = document.getElementById(containerId); if (!c) return
    if (!products || products.length === 0) { c.innerHTML = '<div style="text-align:center;padding:30px;color:var(--text2)">Товары не найдены</div>'; return }
    function catName(c) { return {coils:'Испарители',pod:'Устройства',liquid:'Жидкости',accessories:'Аксессуары',disposable:'Одноразки',device:'Устройства',cartridge:'Картриджи',booster:'Бустеры',battery:'АКБ',charger:'Зарядки',drip:'Шайбы',coil:'Испарители'}[c]||c }
    c.innerHTML = products.map((p,i) => `<div class="product-card" data-category="${p.category}" style="animation-delay:${i*0.04}s" onclick="addToCart('${p.id}')"><div class="product-card__image">${p.emoji}</div><div class="product-card__category">${catName(p.category)}</div><div class="product-card__title">${p.name}</div><div class="product-card__description">${p.description || p.descr || ''}</div><div class="product-card__footer"><div><div class="product-card__price">${p.price} ₽</div>${p.priceOpt ? `<div class="product-card__price-opt">Опт: ${p.priceOpt} ₽</div>` : ''}</div></div></div>`).join('')
}
function addToCart(productId, qty = 1) {
    const p = products.find(x => x.id === productId); if (!p) return
    const existing = cart.find(i => i.id === productId)
    if (existing) { existing.qty += qty } else { cart.push({ id: productId, qty, name: p.name, price: p.price, emoji: p.emoji }) }
    saveCart(); toast(`${p.emoji} ${p.name} — в корзине`)
    const btn = event?.target?.closest('.product-card') || document.querySelector(`[onclick*="'${productId}'"]`)
    if (btn) { const rect = btn.getBoundingClientRect(); flyToCart(rect.left + rect.width / 2, rect.top + rect.height / 2, p.emoji) }
}
function flyToCart(x, y, emoji) {
    const el = document.createElement('div'); el.className = 'fly-to-cart'; el.textContent = emoji
    el.style.left = x + 'px'; el.style.top = y + 'px'
    const target = document.querySelector('.cart-count'); if (!target) { el.remove(); return }
    const tr = target.getBoundingClientRect()
    el.style.setProperty('--tx', (tr.left + tr.width / 2 - x) + 'px')
    el.style.setProperty('--ty', (tr.top + tr.height / 2 - y) + 'px')
    document.body.appendChild(el)
    el.addEventListener('animationend', () => { el.remove(); document.querySelectorAll('.cart-count').forEach(e => { e.classList.remove('cart-count--bump'); void e.offsetWidth; e.classList.add('cart-count--bump') }) })
}
function removeFromCart(productId) { cart = cart.filter(i => i.id !== productId); saveCart(); renderCart() }
function changeQty(productId, delta) {
    const item = cart.find(i => i.id === productId); if (!item) return
    item.qty += delta; if (item.qty <= 0) { removeFromCart(productId); return }
    saveCart(); renderCart()
}
function clearCart() { cart = []; saveCart(); renderCart() }
function renderCart() {
    const c = document.getElementById('cartItems'); if (!c) return
    if (cart.length === 0) { c.innerHTML = '<div class="cart-empty"><div class="cart-empty__icon">🛒</div><h2 class="cart-empty__title">Корзина пуста</h2><p class="cart-empty__text">Добавьте товары из каталога</p><a href="catalog.html" class="btn btn--primary">В каталог</a></div>'; document.getElementById('cartTotalItems').textContent = '0'; document.getElementById('cartTotalPrice').textContent = '0 ₽'; return }
    c.innerHTML = cart.map(i => `<div class="cart-item"><div class="cart-item__image">${i.emoji}</div><div class="cart-item__info"><h3>${i.name}</h3><p>${i.price} ₽ × ${i.qty}</p></div><div class="cart-item__controls"><button class="cart-item__qty-btn" onclick="changeQty('${i.id}',-1)">−</button><span class="cart-item__qty">${i.qty}</span><button class="cart-item__qty-btn" onclick="changeQty('${i.id}',1)">+</button><span class="cart-item__price">${i.price * i.qty} ₽</span><button class="cart-item__remove" onclick="removeFromCart('${i.id}')">✕</button></div></div>`).join('')
    const totalItems = cart.reduce((s, i) => s + i.qty, 0); const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0)
    document.getElementById('cartTotalItems').textContent = totalItems; document.getElementById('cartTotalPrice').textContent = totalPrice.toLocaleString() + ' ₽'
}
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI()
    const cats = ['coil','device','disposable','liquid','drip','booster','battery']
    cats.forEach(c => { const el = document.getElementById('count'+c.charAt(0).toUpperCase()+c.slice(1)); if (el) el.textContent = products.filter(p => p.category === c).length })
    const countAll = document.getElementById('countAll'); if (countAll) countAll.textContent = products.length
    if (document.getElementById('catalogProducts')) renderProducts(products, 'catalogProducts')
    if (document.getElementById('featuredProducts')) renderProducts(products.filter(p => p.featured).slice(0, 4), 'featuredProducts')
    if (document.getElementById('cartItems')) renderCart()
    const burger = document.getElementById('burger'); const nav = document.getElementById('nav'); const overlay = document.getElementById('mobileOverlay')
    if (burger) burger.addEventListener('click', () => { nav.classList.toggle('nav--open'); overlay?.classList.toggle('mobile-overlay--visible') })
    if (overlay) overlay.addEventListener('click', () => { nav.classList.remove('nav--open'); overlay.classList.remove('mobile-overlay--visible') })
    document.querySelectorAll('.nav__link').forEach(l => l.addEventListener('click', () => { nav?.classList.remove('nav--open'); overlay?.classList.remove('mobile-overlay--visible') }))
    const themeToggle = document.getElementById('themeToggle')
    if (themeToggle) {
        const saved = localStorage.getItem('theme')
        if (saved === 'light') { document.documentElement.setAttribute('data-theme', 'light'); themeToggle.textContent = '☀️' }
        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme')
            if (current === 'light') { document.documentElement.removeAttribute('data-theme'); themeToggle.textContent = '🌙'; localStorage.setItem('theme', 'dark') }
            else { document.documentElement.setAttribute('data-theme', 'light'); themeToggle.textContent = '☀️'; localStorage.setItem('theme', 'light') }
        })
    }
    const searchInput = document.getElementById('searchInput')
    if (searchInput) searchInput.addEventListener('input', () => {
        const q = searchInput.value.toLowerCase().trim()
        const filtered = q ? products.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)) : products
        const activeFilter = document.querySelector('.filter-btn--active')?.dataset.category
        const final = activeFilter && activeFilter !== 'all' ? filtered.filter(p => p.category === activeFilter) : filtered
        renderProducts(final, 'catalogProducts')
    })
    const filters = document.querySelectorAll('.filter-btn')
    filters.forEach(f => f.addEventListener('click', () => {
        filters.forEach(b => b.classList.remove('filter-btn--active'))
        f.classList.add('filter-btn--active')
        const cat = f.dataset.category
        const q = document.getElementById('searchInput')?.value?.toLowerCase().trim() || ''
        let filtered = q ? products.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)) : products
        if (cat !== 'all') filtered = filtered.filter(p => p.category === cat)
        renderProducts(filtered, 'catalogProducts')
    }))
    const heroSearchInput = document.getElementById('heroSearchInput')
    const heroSearchResults = document.getElementById('heroSearchResults')
    if (heroSearchInput && heroSearchResults) {
        heroSearchInput.addEventListener('input', () => {
            const q = heroSearchInput.value.toLowerCase().trim()
            if (q.length < 2) { heroSearchResults.classList.remove('hero-search__results--visible'); return }
            const matched = products.filter(p => p.name.toLowerCase().includes(q)).slice(0, 6)
            if (matched.length === 0) { heroSearchResults.classList.remove('hero-search__results--visible'); return }
            heroSearchResults.innerHTML = matched.map(p => `<div class="hero-search__item" onclick="location.href='catalog.html'"><span class="hero-search__item-emoji">${p.emoji}</span><div><div class="hero-search__item-name">${p.name}</div><div class="hero-search__item-price">${p.price} ₽</div></div></div>`).join('')
            heroSearchResults.classList.add('hero-search__results--visible')
        })
        document.addEventListener('click', (e) => { if (!e.target.closest('.hero-search')) heroSearchResults?.classList.remove('hero-search__results--visible') })
    }
    const checkoutBtn = document.getElementById('checkoutBtn')
    const orderModal = document.getElementById('orderModal')
    const modalClose = document.getElementById('modalClose')
    if (checkoutBtn && orderModal) checkoutBtn.addEventListener('click', () => { if (cart.length === 0) { toast('Корзина пуста!', 'error'); return }; orderModal.classList.add('modal--open') })
    if (modalClose && orderModal) modalClose.addEventListener('click', () => orderModal.classList.remove('modal--open'))
    if (orderModal) orderModal.querySelector('.modal__overlay')?.addEventListener('click', () => orderModal.classList.remove('modal--open'))
    const orderForm = document.getElementById('orderForm')
    if (orderForm) orderForm.addEventListener('submit', (e) => {
        e.preventDefault()
        const name = document.getElementById('orderName').value.trim()
        const phone = document.getElementById('orderPhone').value.trim()
        const social = document.getElementById('orderSocial')?.value?.trim() || ''
        const comment = document.getElementById('orderComment')?.value?.trim() || ''
        const delivery = document.querySelector('input[name="delivery"]:checked')?.value || 'pickup'
        if (!name || !phone) { toast('Заполните имя и телефон', 'error'); return }
        if (phone.length !== 11) { toast('Номер должен содержать 11 цифр', 'error'); return }
        const total = cart.reduce((s, i) => s + i.price * i.qty, 0)
        sendTelegramNotification(name, phone, social, cart, total, comment, delivery)
        toast('✅ Заказ отправлен! Мы свяжемся с вами.')
        orderModal.classList.remove('modal--open')
        cart = []; saveCart(); renderCart()
    })
    const clearCartBtn = document.getElementById('clearCartBtn')
    if (clearCartBtn) clearCartBtn.addEventListener('click', () => { if (cart.length === 0) return; if (confirm('Очистить корзину?')) { clearCart(); toast('Корзина очищена') } })
    const faqItems = document.querySelectorAll('.faq-item')
    faqItems.forEach(item => { item.querySelector('.faq-item__question')?.addEventListener('click', () => item.classList.toggle('faq-item--open')) })
    const contactForm = document.getElementById('contactForm')
    if (contactForm) contactForm.addEventListener('submit', (e) => {
        e.preventDefault()
        const name = document.getElementById('contactName').value.trim()
        const phone = document.getElementById('contactPhone').value.trim()
        const message = document.getElementById('contactMessage').value.trim()
        if (!name || !phone || !message) { toast('Заполните все поля', 'error'); return }
        sendContactNotification(name, phone, message)
        toast('✅ Сообщение отправлено!')
        contactForm.reset()
    })
})
function togglePickupTime() {
    const g = document.getElementById('pickupTimeGroup')
    if (g) g.style.display = document.querySelector('input[name="delivery"]:checked')?.value === 'pickup' ? 'block' : 'none'
}
