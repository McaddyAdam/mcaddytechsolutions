(function ($) {
    "use strict";

    // ── Pre-configuration ──────────────────────────────────────────────────────
    // No client-side email service is required. Forms submit directly to the backend API.

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    // Initiate the wowjs
    new WOW().init();

    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 45) {
            $('.navbar').addClass('sticky-top shadow-sm');
        } else {
            $('.navbar').removeClass('sticky-top shadow-sm');
        }
    });
    
    // Dropdown on mouse hover
    const $dropdown = $(".dropdown");
    const $dropdownToggle = $(".dropdown-toggle");
    const $dropdownMenu = $(".dropdown-menu");
    const showClass = "show";
    
    $(window).on("load resize", function() {
        if (this.matchMedia("(min-width: 992px)").matches) {
            $dropdown.hover(
                function() {
                    const $this = $(this);
                    $this.addClass(showClass);
                    $this.find($dropdownToggle).attr("aria-expanded", "true");
                    $this.find($dropdownMenu).addClass(showClass);
                },
                function() {
                    const $this = $(this);
                    $this.removeClass(showClass);
                    $this.find($dropdownToggle).attr("aria-expanded", "false");
                    $this.find($dropdownMenu).removeClass(showClass);
                }
            );
        } else {
            $dropdown.off("mouseenter mouseleave");
        }
    });

    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });

    // ── Consolidated Form Handlers ─────────────────────────────────────────────
    
    $(document).ready(function() {
        
        // 1. Newsletter Subscription
        $('#newsletterForm').on('submit', async function(e) {
            e.preventDefault();
            const emailInput = $('#newsletterEmail');
            const email = emailInput.val().trim();
            const messageDiv = $('#newsletterMessage');
            const submitBtn = $(this).find('button[type="submit"]');

            if (!email) return;

            submitBtn.prop('disabled', true).text('...');
            messageDiv.hide();

            try {
                        const response = await fetch('/api/newsletter', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email })
                });

                if (response.ok) {
                    messageDiv.html('<span style="color: #4CAF50;">✅ Subscribed successfully!</span>').fadeIn();
                    emailInput.val('');
                } else {
                    const result = await response.json();
                    messageDiv.html(`<span style="color: #ff6b6b;">${result.error || 'Failed to subscribe.'}</span>`).fadeIn();
                }
            } catch (err) {
                console.error('Newsletter error:', err);
                messageDiv.html('<span style="color: #ff6b6b;">Error sending subscription request.</span>').fadeIn();
            } finally {
                submitBtn.prop('disabled', false).text('SUBSCRIBE');
            }
        });

        // 2. Contact Form
        $('#contactForm').on('submit', async function(e) {
            e.preventDefault();
            const btn = $(this).find('button[type="submit"]');
            const msgDiv = $('#contactFormMessage');
            
            const data = {
                formType: 'Contact Form',
                name: $('#contactName').val(),
                email: $('#contactEmail').val(),
                subject: $('#contactSubject').val(),
                message: $('#contactMessage').val()
            };
            
            btn.prop('disabled', true).text('Sending...');
            
            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    msgDiv.html('<span style="color: #4CAF50;">✅ Message sent successfully!</span>');
                    this.reset();
                } else {
                    msgDiv.html('<span style="color: #ff6b6b;">Failed to send.</span>');
                }
            } catch (err) {
                console.error('Contact error:', err);
                msgDiv.html('<span style="color: #ff6b6b;">Connection error.</span>');
            } finally {
                btn.prop('disabled', false).text('Send Message');
            }
        });

        // 3. Quote Form (Request Service)
        $('#quoteForm, #homeQuoteForm').on('submit', async function(e) {
            e.preventDefault();
            const isHome = this.id === 'homeQuoteForm';
            const btn = $(this).find('button[type="submit"]');
            const msgDiv = isHome ? $('#homeQuoteFormMessage') : $('#quoteFormMessage');
            
            const data = {
                formType: isHome ? 'Home Page Quote Form' : 'Service Request Form',
                name: $(this).find('input[type="text"]').first().val(),
                email: $(this).find('input[type="email"]').val(),
                subject: 'Service: ' + ($(this).find('select').val() || 'Request'),
                message: $(this).find('textarea').val()
            };
            
            btn.prop('disabled', true).text('Sending...');
            
            try {
                const response = await fetch('/api/quote', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    msgDiv.html('<span style="color: #4CAF50;">✅ Request submitted successfully!</span>');
                    this.reset();
                } else {
                    msgDiv.html('<span style="color: #ff6b6b;">Failed to submit.</span>');
                }
            } catch (err) {
                console.error('Quote error:', err);
                msgDiv.html('<span style="color: #ff6b6b;">Connection error.</span>');
            } finally {
                btn.prop('disabled', false).text(isHome ? 'Submit' : 'Request A Quote');
            }
        });
    });

})(jQuery);
