const video1 = document.getElementById('projectVideo1');
const video2 = document.getElementById('projectVideo2');
const video3 = document.getElementById('projectVideo3');

// Sidebar elements //
const sideBar = document.querySelector('.sidebar');
const menu = document.querySelector('.menu-icon');
const closeIcon = document.querySelector('.close-icon')


const hoverSign = document.querySelector('.hover-sign');

const videoList =[video1, video2, video3];

videoList.forEach (function(video){
    video.addEventListener("mouseover", function(){
        video.play()
        hoverSign.classList.add("active")
    })
    video.addEventListener("mouseout", function(){
    video.pause();
    hoverSign.classList.remove("active")
})
})

// Sidebar elements //
menu.addEventListener("click", function(){
    sideBar.classList.remove("close-sidebar")
    sideBar.classList.add("open-sidebar")
});

closeIcon.addEventListener("click", function(){
    sideBar.classList.remove("open-sidebar");
    sideBar.classList.add("close-sidebar");
    
})
// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

// Form inputs
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const userMessage = document.getElementById('userMessage');

// Error message elements
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const messageError = document.getElementById('messageError');

// Your Google Script URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzaajCCRP-U0VCxlRHruPoZhU5LmxovZXF3DbWwNp2HAV4h4Mcgyg4csTgg8IA4QocT9Q/exec';

// Security: Rate limiting (prevent spam)
let lastSubmitTime = 0;
const SUBMIT_COOLDOWN = 3000;

// Regex patterns for validation
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
const nameRegex = /^[a-zA-Z\s]{2,50}$/;

// Sanitize input to prevent XSS attacks
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// Validate Name
function validateName() {
    if (!userName) return true; // Skip if element doesn't exist
    
    const name = userName.value.trim();
    
    if (name === '') {
        if (nameError) nameError.textContent = 'Name is required';
        userName.classList.add('input-error');
        userName.classList.remove('input-success');
        return false;
    }
    
    if (!nameRegex.test(name)) {
        if (nameError) nameError.textContent = 'Name should only contain letters (2-50 characters)';
        userName.classList.add('input-error');
        userName.classList.remove('input-success');
        return false;
    }
    
    if (nameError) nameError.textContent = '';
    userName.classList.remove('input-error');
    userName.classList.add('input-success');
    return true;
}

// Validate Email with Regex
function validateEmail() {
    if (!userEmail) return true; // Skip if element doesn't exist
    
    const email = userEmail.value.trim();
    
    if (email === '') {
        if (emailError) emailError.textContent = 'Email is required';
        userEmail.classList.add('input-error');
        userEmail.classList.remove('input-success');
        return false;
    }
    
    if (!emailRegex.test(email)) {
        if (emailError) emailError.textContent = 'Please enter a valid email address';
        userEmail.classList.add('input-error');
        userEmail.classList.remove('input-success');
        return false;
    }
    
    if (emailError) {
        emailError.textContent = '✓ Valid email';
        emailError.style.color = '#00ff88';
    }
    userEmail.classList.remove('input-error');
    userEmail.classList.add('input-success');
    return true;
}

// Validate Message
function validateMessage() {
    if (!userMessage) return true; // Skip if element doesn't exist
    
    const message = userMessage.value.trim();
    
    if (message === '') {
        if (messageError) messageError.textContent = 'Message is required';
        userMessage.classList.add('input-error');
        userMessage.classList.remove('input-success');
        return false;
    }
    
    if (message.length < 10) {
        if (messageError) messageError.textContent = 'Message should be at least 10 characters long';
        userMessage.classList.add('input-error');
        userMessage.classList.remove('input-success');
        return false;
    }
    
    if (message.length > 500) {
        if (messageError) messageError.textContent = 'Message should not exceed 500 characters';
        userMessage.classList.add('input-error');
        userMessage.classList.remove('input-success');
        return false;
    }
    
    if (messageError) messageError.textContent = '';
    userMessage.classList.remove('input-error');
    userMessage.classList.add('input-success');
    return true;
}

// Real-time validation on input
if (userName) {
    userName.addEventListener('blur', validateName);
    userName.addEventListener('input', () => {
        if (userName.value.trim() !== '') {
            validateName();
        }
    });
}

if (userEmail) {
    userEmail.addEventListener('blur', validateEmail);
    userEmail.addEventListener('input', () => {
        if (userEmail.value.trim() !== '') {
            validateEmail();
        }
    });
}

if (userMessage) {
    userMessage.addEventListener('blur', validateMessage);
    userMessage.addEventListener('input', () => {
        if (userMessage.value.trim() !== '') {
            validateMessage();
        }
    });
}

// Form submission with debugging
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        console.log('🔵 Form submitted');
        
        // Validate all fields
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isMessageValid = validateMessage();
        
        console.log('🔵 Validation:', { isNameValid, isEmailValid, isMessageValid });
        
        if (!isNameValid || !isEmailValid || !isMessageValid) {
            console.log('🔴 Validation failed');
            if (formStatus) {
                formStatus.textContent = '❌ Please fix the errors above';
                formStatus.style.color = '#ff4444';
            }
            return;
        }
        
        // Rate limiting check
        const currentTime = Date.now();
        if (currentTime - lastSubmitTime < SUBMIT_COOLDOWN) {
            console.log('🟡 Rate limit hit');
            if (formStatus) {
                formStatus.textContent = '⏳ Please wait a few seconds before submitting again';
                formStatus.style.color = '#ff8800';
            }
            return;
        }
        lastSubmitTime = currentTime;
        
        // Prepare form data
        const formData = {
            name: sanitizeInput(userName.value.trim()),
            email: sanitizeInput(userEmail.value.trim().toLowerCase()),
            message: sanitizeInput(userMessage.value.trim())
        };
        
        console.log('🔵 Sending data:', formData);
        console.log('🔵 To URL:', GOOGLE_SCRIPT_URL);
        
        // Show loading message
        if (formStatus) {
            formStatus.textContent = '⏳ Sending message...';
            formStatus.style.color = '#72a1de';
        }
        
        // Disable submit button
        const submitButton = contactForm.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.style.opacity = '0.6';
        }
        
        try {
            console.log('🔵 Starting fetch...');
            
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            console.log('🟢 Response received:', response);
            
            // Success message
            if (formStatus) {
                formStatus.textContent = '✅ Message sent successfully! Thank you for contacting me.';
                formStatus.style.color = '#00ff88';
            }
            
            // Clear form
            contactForm.reset();
            
            // Remove validation classes
            if (userName) userName.classList.remove('input-success', 'input-error');
            if (userEmail) userEmail.classList.remove('input-success', 'input-error');
            if (userMessage) userMessage.classList.remove('input-success', 'input-error');
            
            // Clear error messages
            if (nameError) nameError.textContent = '';
            if (emailError) emailError.textContent = '';
            if (messageError) messageError.textContent = '';
            
            // Re-enable submit button
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.style.opacity = '1';
            }
            
            console.log('🟢 Form submitted successfully! Check your Google Sheet.');
            
            // Clear success message after 5 seconds
            setTimeout(() => {
                if (formStatus) formStatus.textContent = '';
            }, 5000);
            
        } catch (error) {
            console.error('🔴 Fetch error:', error);
            
            if (formStatus) {
                formStatus.textContent = '❌ Error sending message. Please try again.';
                formStatus.style.color = '#ff4444';
            }
            
            // Re-enable submit button
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.style.opacity = '1';
            }
        }
    });
    
    console.log('🟢 Contact form handler loaded successfully');
} else {
    console.log('🔴 Contact form not found!');
}