const NTFY_TOPIC = 'vapeshop33'
function sendToNtfy(text) {
    new Image().src = 'https://ntfy.sh/' + NTFY_TOPIC + '/publish?message=' + encodeURIComponent(text)
}
function sendTelegramNotification(name, phone, items, total, comment, delivery) {
    sendToNtfy('🆕 Новый заказ VapeShop!\n👤 Имя: ' + name + '\n📞 Телефон: ' + phone + '\n📦 Получение: ' + (delivery === 'pickup' ? 'Самовывоз' : 'Доставка') + '\n\n🛒 Товары:\n' + items.map(i => i.emoji + ' ' + i.name + ' x' + i.qty + ' — ' + i.price + ' ₽').join('\n') + '\n\n💰 Итого: ' + total + ' ₽' + (comment ? '\n\n💬 Комментарий: ' + comment : ''))
}
function sendContactNotification(name, phone, message) {
    sendToNtfy('✉️ Сообщение с сайта\n👤 Имя: ' + name + '\n📞 Телефон: ' + phone + '\n💬 Сообщение: ' + message)
}
