const NTFY_TOPIC = 'vapeshop33'
function sendTelegramNotification(name, phone, items, total, comment, delivery) {
    const text = `🆕 *Новый заказ VapeShop!*\n\n👤 *Имя:* ${name}\n📞 *Телефон:* ${phone}\n📦 *Способ получения:* ${delivery === 'pickup' ? 'Самовывоз' : 'Доставка'}\n\n🛒 *Товары:*\n${items.map(i => `${i.emoji} ${i.name} x${i.qty} — ${i.price} ₽`).join('\n')}\n\n💰 *Итого:* ${total} ₽\n${comment ? `\n💬 *Комментарий:* ${comment}` : ''}`
    fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain', 'Title': '🆕 Новый заказ VapeShop', 'Markdown': 'yes', 'Priority': 'high' },
        body: text
    }).catch(() => {})
}
function connectTelegram() {
    const id = document.getElementById('chatIdInput')?.value?.trim()
    if (!id) { alert('Введите Chat ID'); return }
    const botToken = '8990430263:AAGQmAlhFR5JGNaQwlu9lJkRAOpPVH4UQi4'
    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
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
    const botToken = '8990430263:AAGQmAlhFR5JGNaQwlu9lJkRAOpPVH4UQi4'
    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: id, text: '🔔 Тестовое уведомление от VapeShop_OptTeamBuy_33 — всё работает!' })
    }).then(r => r.json()).then(d => {
        if (d.ok) { alert('✅ Тест отправлен!') }
        else { alert('❌ Ошибка: ' + d.description) }
    }).catch(() => alert('Ошибка соединения'))
}
