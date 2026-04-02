(function ($) {
    "use strict";

    // ── Pre-configuration ──────────────────────────────────────────────────────
    // ⚠️ TODO: Replace with your actual EmailJS credentials
    // You can find these in your EmailJS Dashboard (https://dashboard.emailjs.com/)
    const EMAILJS_PUBLIC_KEY = 'o-ew1ujVotpaKUpdO'; // From "Account" page
    const EMAILJS_SERVICE_ID = 'service_yr4w7ek'; // From "Email Services" page
    const EMAILJS_TEMPLATE_ID = 'template_mcaddy_notification'; // From "Email Templates" page

    // Initialize EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    } else {
        console.error('EmailJS not found. Make sure the script is in index.html');
    }

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

    // ── Email Automation with EmailJS ──────────────────────────────────────────
    
    /**
     * Helper to send notification to admin via EmailJS
     * @param {Object} data - The form data
     * @param {String} source - Identification of which form was used
     */
    async function sendAdminNotification(data, source) {
        if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
            console.warn('⚠️  EmailJS not configured in main.js. Please fill in your keys.');
            return;
        }

        const templateParams = {
            source_form: source,
            from_name: data.name || 'Subscriber',
            from_email: data.email,
            subject: data.subject || 'New Submission from Website',
            message: data.message || 'New newsletter subscription!',
            submitted_at: new Date().toLocaleString()
        };

        try {
            await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
            console.log(`[EmailJS] Notification sent for: ${source}`);
        } catch (error) {
            console.error('[EmailJS] FAILED to send notification:', error);
        }
    }

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
                // Phase 1: Save to Database
                const response = await fetch('/api/newsletter', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email })
                });

                if (response.ok) {
                    // Phase 2: Send Automation via EmailJS
                    await sendAdminNotification({ email: email }, 'Newsletter Form');
                    
                    messageDiv.html('<span style="color: #4CAF50;">✅ Subscribed successfully!</span>').fadeIn();
                    emailInput.val('');
                } else {
                    const result = await response.json();
                    messageDiv.html(`<span style="color: #ff6b6b;">${result.error || 'Failed to subscribe.'}</span>`).fadeIn();
                }
            } catch (err) {
                console.error('Newsletter error:', err);
                messageDiv.html('<span style="color: #ff6b6b;">Error connecting to database.</span>').fadeIn();
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
                    await sendAdminNotification(data, 'Contact Us Form');
                    msgDiv.html('<span style="color: #4CAF50;">✅ Message sent successfully!</span>');
                    this.reset();
                } else {
                    msgDiv.html('<span style="color: #ff6b6b;">Failed to send to database.</span>');
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
                    await sendAdminNotification(data, data.formType);
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
