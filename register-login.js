// Global Variables
let registeredUsers = [] // Kayıtlı kullanıcıları tutacak array

// Initialize Welcome Screen
document.addEventListener("DOMContentLoaded", () => {
  initializeWelcomeScreen()
})

function initializeWelcomeScreen() {
  // Load registered users from localStorage
  const savedUsers = localStorage.getItem('registeredUsers')
  if (savedUsers) {
    registeredUsers = JSON.parse(savedUsers)
  }
  
  // Check if user is already logged in
  const currentUser = localStorage.getItem('currentUser')
  if (currentUser) {
    // Redirect to main app
    window.location.href = 'index.html'
    return
  }
  
  // Initialize event listeners
  initializeEventListeners()
}

function initializeEventListeners() {
  // Auth forms
  document.getElementById("registerForm").addEventListener("submit", handleRegister)
  document.getElementById("loginForm").addEventListener("submit", handleLogin)
}

// Auth Functions
function showAuth(type) {
  document.getElementById("welcomeScreen").classList.add("hidden")
  document.getElementById("authScreen").classList.add("active")
  
  if (type === 'register') {
    switchToRegister()
  } else {
    switchToLogin()
  }
}

function backToWelcome() {
  document.getElementById("authScreen").classList.remove("active")
  document.getElementById("welcomeScreen").classList.remove("hidden")
}

function switchToRegister() {
  document.getElementById("authTitle").textContent = "Kayıt Ol"
  document.getElementById("registerForm").style.display = "block"
  document.getElementById("loginForm").style.display = "none"
}

function switchToLogin() {
  document.getElementById("authTitle").textContent = "Giriş Yap"
  document.getElementById("registerForm").style.display = "none"
  document.getElementById("loginForm").style.display = "block"
}

function handleRegister(e) {
  e.preventDefault()
  
  const name = document.getElementById("regName").value
  const email = document.getElementById("regEmail").value
  const phone = document.getElementById("regPhone").value
  const password = document.getElementById("regPassword").value
  
  // Validation
  if (!name || !email || !phone || !password) {
    showNotification("Lütfen tüm alanları doldurun!", "error")
    return
  }
  
  // Check if user already exists
  const existingUser = registeredUsers.find(user => user.email === email)
  if (existingUser) {
    showNotification("Bu e-posta adresi zaten kayıtlı!", "error")
    return
  }
  
  const userData = {
    id: Date.now(),
    name: name,
    email: email,
    phone: phone,
    password: password,
    joinDate: new Date().toISOString().split("T")[0],
    sharedCount: 0,
    receivedCount: 0
  }
  
  // Save to registered users
  registeredUsers.push(userData)
  localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers))
  
  // Set as current user
  localStorage.setItem('currentUser', JSON.stringify(userData))
  
  showNotification("Kayıt başarılı! Yönlendiriliyorsunuz...", "success")
  
  setTimeout(() => {
    window.location.href = 'index.html'
  }, 1500)
}

function handleLogin(e) {
  e.preventDefault()
  
  const email = document.getElementById("loginEmail").value
  const password = document.getElementById("loginPassword").value
  
  // Validation
  if (!email || !password) {
    showNotification("Lütfen e-posta ve şifrenizi girin!", "error")
    return
  }
  
  // Find user in registered users
  const user = registeredUsers.find(user => user.email === email && user.password === password)
  
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user))
    
    showNotification("Giriş başarılı! Yönlendiriliyorsunuz...", "success")
    
    setTimeout(() => {
      window.location.href = 'index.html'
    }, 1500)
  } else {
    showNotification("E-posta veya şifre hatalı!", "error")
  }
}

function showNotification(message, type = "success") {
  // Remove existing notification if any
  const existingNotification = document.querySelector('.notification')
  if (existingNotification) {
    existingNotification.remove()
  }
  
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.textContent = message

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.remove()
  }, 3000)
}