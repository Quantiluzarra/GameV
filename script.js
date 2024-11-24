document.addEventListener('DOMContentLoaded', function() {
    AOS.init();

    const form = document.getElementById('contactForm');
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        alert('Сообщение отправлено!');
        form.reset();
    });
});
