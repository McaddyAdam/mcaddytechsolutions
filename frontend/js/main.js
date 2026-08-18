(function ($) {
    "use strict";

    // EmailJS configuration
    const EMAILJS_SERVICE_ID = 'service_yr4w7ek';
    const EMAILJS_TEMPLATE_ID = 'template_06z0nqi';
    const EMAILJS_PUBLIC_KEY = '30T2_xK0T6hsn5uR5';

    emailjs.init(EMAILJS_PUBLIC_KEY);

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
        $('#newsletterForm').on('submit', function(e) {
            e.preventDefault();
            const emailInput = $('#newsletterEmail');
            const email = emailInput.val().trim();
            const messageDiv = $('#newsletterMessage');
            const submitBtn = $(this).find('button[type="submit"]');

            if (!email) return;

            submitBtn.prop('disabled', true).text('...');
            messageDiv.hide();

            emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                form_type: 'Newsletter Subscription',
                from_name: 'Newsletter Subscriber',
                from_email: email,
                subject: 'Newsletter Subscription',
                message: 'A user subscribed to the newsletter with email: ' + email
            }).then(function() {
                messageDiv.html('<span style="color: #4CAF50;">✅ Subscribed successfully!</span>').fadeIn();
                emailInput.val('');
            }).catch(function() {
                messageDiv.html('<span style="color: #ff6b6b;">Error sending subscription request.</span>').fadeIn();
            }).finally(function() {
                submitBtn.prop('disabled', false).text('SUBSCRIBE');
            });
        });

        // 2. Contact Form
        $('#contactForm').on('submit', function(e) {
            e.preventDefault();
            const form = this;
            const btn = $(form).find('button[type="submit"]');
            const msgDiv = $('#contactFormMessage');

            btn.prop('disabled', true).text('Sending...');

            emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                form_type: 'Contact Form',
                from_name: $('#contactName').val(),
                from_email: $('#contactEmail').val(),
                subject: $('#contactSubject').val() || 'Contact Form Submission',
                message: $('#contactMessage').val()
            }).then(function() {
                msgDiv.html('<span style="color: #4CAF50;">✅ Message sent successfully!</span>');
                form.reset();
            }).catch(function() {
                msgDiv.html('<span style="color: #ff6b6b;">Failed to send. Please try again.</span>');
            }).finally(function() {
                btn.prop('disabled', false).text('Send Message');
            });
        });

        // 3. Quote Form (Request Service)
        $('#quoteForm, #homeQuoteForm').on('submit', function(e) {
            e.preventDefault();
            const form = this;
            const isHome = form.id === 'homeQuoteForm';
            const btn = $(form).find('button[type="submit"]');
            const msgDiv = isHome ? $('#homeQuoteFormMessage') : $('#quoteFormMessage');
            const name = isHome ? $('#homeQuoteName').val() : $('#quoteName').val();
            const email = isHome ? $('#homeQuoteEmail').val() : $('#quoteEmail').val();
            const service = isHome ? $('#homeQuoteService').val() : $('#quoteService').val();
            const message = isHome ? $('#homeQuoteMessage').val() : $('#quoteMessage').val();

            btn.prop('disabled', true).text('Sending...');

            emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                form_type: isHome ? 'Home Quote Form' : 'Service Request Form',
                from_name: name,
                from_email: email,
                subject: 'Service Request: ' + (service || 'General'),
                message: message
            }).then(function() {
                msgDiv.html('<span style="color: #4CAF50;">✅ Request submitted successfully!</span>');
                form.reset();
            }).catch(function() {
                msgDiv.html('<span style="color: #ff6b6b;">Failed to submit. Please try again.</span>');
            }).finally(function() {
                btn.prop('disabled', false).text(isHome ? 'Submit' : 'Submit Quote Request');
            });
        });
    });

})(jQuery);
