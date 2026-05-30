const NTFY_TOPIC = 'vapeshop33'
function sendToNtfy(text) {
    const f = document.getElementById('ntfyForm')
    if (!f) {
        const ifr = document.createElement('iframe')
        ifr.id = 'ntfyFrame'; ifr.name = 'ntfyFrame'
        ifr.style.display = 'none'
        document.body.appendChild(ifr)
        const fm = document.createElement('form')
        fm.id = 'ntfyForm'; fm.action = 'https://ntfy.sh/' + NTFY_TOPIC
        fm.method = 'POST'; fm.target = 'ntfyFrame'
        fm.style.display = 'none'
        const inp = document.createElement('input')
        inp.type = 'hidden'; inp.name = 'message'; inp.id = 'ntfyMsg'
        fm.appendChild(inp); document.body.appendChild(fm)
    }
    document.getElementById('ntfyMsg').value = text
    document.getElementById('ntfyForm').submit()
}
function sendTelegramNotification(name, phone, items, total, comment, delivery) {
    sendToNtfy(`🆕 Новый заказ VapeShop!
👤 Имя: ${name}
📞 Телефон: ${phone}
📦 Получение: ${delivery === 'pickup' ? 'Самовывоз' : 'Доставка'}

🛒 Товары:
${items.map(i => `${i.emoji} ${i.name} x${i.qty} — ${i.price} ₽`).join('\n')}

💰 Итого: ${total} ₽${comment ? `\n💬 Комментарий: ${comment}` : ''}`)
}
function sendContactNotification(name, phone, message) {
    sendToNtfy(`✉️ Сообщение с сайта
👤 Имя: ${name}
📞 Телефон: ${phone}
💬 Сообщение: ${message}`)
}
