const NTFY_TOPIC = 'vapeshop33'
function sendTelegramNotification(name, phone, social, items, total, comment, delivery) {
    let text = `🆕 Новый заказ VapeShop!
👤 Имя: ${name}
📞 Телефон: ${phone}`
    if (social) text += `\n💬 TG/ВК: ${social}`
    text += `\n📦 Получение: ${delivery === 'pickup' ? 'Самовывоз' : 'Доставка'}

🛒 Товары:
${items.map(i => `${i.emoji} ${i.name} x${i.qty} — ${i.price} ₽`).join('\n')}

💰 Итого: ${total} ₽${comment ? `\n\n💬 Комментарий: ${comment}` : ''}`
    fetch(`https://ntfy.sh/${NTFY_TOPIC}`, { method: 'POST', body: text }).catch(() => {})
}
function sendContactNotification(name, phone, message) {
    const text = `✉️ Сообщение с сайта
👤 Имя: ${name}
📞 Телефон: ${phone}
💬 Сообщение: ${message}`
    fetch(`https://ntfy.sh/${NTFY_TOPIC}`, { method: 'POST', body: text }).catch(() => {})
}
