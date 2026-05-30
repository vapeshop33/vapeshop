const BOT_TOKEN = '8990430263:AAGQmAlhFR5JGNaQwlu9lJkRAOpPVH4UQi4'
function sendTelegramNotification(name, phone, items, total, comment, delivery) {
    const text = `🆕 *Новый заказ VapeShop!*
👤 *Имя:* ${name}
📞 *Телефон:* ${phone}
📦 *Получение:* ${delivery === 'pickup' ? 'Самовывоз' : 'Доставка'}

🛒 *Товары:*
${items.map(i => `${i.emoji} ${i.name} x${i.qty} — ${i.price} ₽`).join('\n')}

💰 *Итого:* ${total} ₽${comment ? `\n\n💬 *Комментарий:* ${comment}` : ''}`
    const chatId = localStorage.getItem('tgChatId')
    if (chatId) {
        fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' })
        }).catch(() => {})
    }
}
function connectTelegram() {
    const id = document.getElementById('chatIdInput')?.value?.trim()
    if (!id) { alert('Введите Chat ID'); return }
    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: id, text: '✅ Подключение к VapeShop_OptTeamBuy_33 успешно!' })
    }).then(r => r.json()).then(d => {
        if (d.ok) { document.getElementById('tgStatus').textContent = '✅ Подключено!'; localStorage.setItem('tgChatId', id) }
        else { alert('Ошибка: проверьте Chat ID') }
    }).catch(() => alert('Ошибка соединения'))
}
function testTelegram() {
    const id = document.getElementById('chatIdInput')?.value?.trim() || localStorage.getItem('tgChatId')
    if (!id) { alert('Сначала подключите Chat ID'); return }
    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: id, text: '🔔 Тестовое уведомление от VapeShop_OptTeamBuy_33 — всё работает!' })
    }).then(r => r.json()).then(d => {
        if (d.ok) { alert('✅ Тест отправлен!') }
        else { alert('❌ Ошибка: ' + d.description) }
    }).catch(() => alert('Ошибка соединения'))
}
