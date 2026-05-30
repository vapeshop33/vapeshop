const NTFY_TOPIC = 'vapeshop33'
function sendToNtfy(text) {
    let f = document.getElementById('ntfyForm')
    if (!f) {
        const ifr = document.createElement('iframe')
        ifr.id = 'ntfyFrame'; ifr.name = 'ntfyFrame'
        ifr.style.display = 'none'
        document.body.appendChild(ifr)
        f = document.createElement('form')
        f.id = 'ntfyForm'; f.action = 'https://ntfy.sh/' + NTFY_TOPIC
        f.method = 'POST'; f.target = 'ntfyFrame'
        f.style.display = 'none'
        const inp = document.createElement('input')
        inp.type = 'hidden'; inp.name = 'message'; inp.id = 'ntfyMsg'
        f.appendChild(inp); document.body.appendChild(f)
    }
    document.getElementById('ntfyMsg').value = text
    f.submit()
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
