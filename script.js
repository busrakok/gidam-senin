// Sample Data
const sampleFoods = [
  {
    id: 1,
    category: "meyve",
    name: "Elma",
    quantity: "2 kg",
    expiryDate: "2024-01-15",
    busId: 1,
    status: "available",
    notes: "Taze ve lezzetli",
  },
  {
    id: 2,
    category: "sebze",
    name: "Domates",
    quantity: "1.5 kg",
    expiryDate: "2024-01-12",
    busId: 2,
    status: "available",
    notes: "Organik domates",
  },
  {
    id: 3,
    category: "sut",
    name: "Süt",
    quantity: "1 litre",
    expiryDate: "2024-01-10",
    busId: 1,
    status: "reserved",
    notes: "Tam yağlı süt",
  },
  {
    id: 4,
    category: "tahil",
    name: "Ekmek",
    quantity: "3 adet",
    expiryDate: "2024-01-08",
    busId: 3,
    status: "available",
    notes: "Tam buğday ekmeği",
  },
  {
    id: 5,
    category: "et",
    name: "Tavuk",
    quantity: "1 kg",
    expiryDate: "2024-01-14",
    busId: 2,
    status: "available",
    notes: "Dondurulmuş tavuk",
  },
]

const sampleBuses = [
  {
    id: 1,
    name: "Kadıköy Gıda Otobüsü",
    lat: 40.9903,
    lng: 29.0275,
    status: "active",
    address: "Kadıköy Meydanı, İstanbul",
    capacity: 50,
    currentLoad: 23,
  },
  {
    id: 2,
    name: "Beşiktaş Gıda Otobüsü",
    lat: 41.0422,
    lng: 29.0067,
    status: "active",
    address: "Beşiktaş İskelesi, İstanbul",
    capacity: 40,
    currentLoad: 18,
  },
  {
    id: 3,
    name: "Üsküdar Gıda Otobüsü",
    lat: 41.0214,
    lng: 29.0068,
    status: "maintenance",
    address: "Üsküdar Meydanı, İstanbul",
    capacity: 45,
    currentLoad: 0,
  },
]

const sampleOrders = {
  given: [
    {
      id: 1,
      foodName: "Elma",
      quantity: "2 kg",
      status: "confirmed",
      date: "2024-01-05",
      busName: "Kadıköy Gıda Otobüsü",
    },
    {
      id: 2,
      foodName: "Ekmek",
      quantity: "5 adet",
      status: "completed",
      date: "2024-01-03",
      busName: "Beşiktaş Gıda Otobüsü",
    },
  ],
  taken: [
    {
      id: 3,
      foodName: "Süt",
      quantity: "1 litre",
      status: "ready",
      date: "2024-01-06",
      busName: "Kadıköy Gıda Otobüsü",
    },
  ],
}

// Global Variables
let map
const currentFoods = [...sampleFoods]
const currentOrders = { ...sampleOrders }
let currentUser = null
let registeredUsers = [] // Kayıtlı kullanıcıları tutacak array

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
})

function initializeApp() {
  // Load registered users from localStorage
  const savedUsers = localStorage.getItem('registeredUsers')
  if (savedUsers) {
    registeredUsers = JSON.parse(savedUsers)
  }
  
  // Check if user is logged in
  const savedUser = localStorage.getItem('currentUser')
  if (savedUser) {
    currentUser = JSON.parse(savedUser)
    enterApp()
  } else {
    // Redirect to welcome screen
    window.location.href = 'welcome-screen.html'
    return
  }
  
  // Set minimum date for expiry date input
  const today = new Date().toISOString().split("T")[0]
  document.getElementById("expiryDate").setAttribute("min", today)
  
  // Initialize event listeners
  initializeEventListeners()
  
  // Initialize data
  displayFoods(currentFoods)
  displayOrders()
}

function initializeEventListeners() {
  // Share form
  document.getElementById("shareForm").addEventListener("submit", handleShareForm)
  
  // Search functionality
  document.getElementById("searchBtn").addEventListener("click", searchFoods)
  document.getElementById("searchCategory").addEventListener("change", searchFoods)
  document.getElementById("searchProduct").addEventListener("keyup", (e) => {
    if (e.key === "Enter") searchFoods()
  })
  
  // Track tabs
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const targetTab = btn.getAttribute("data-tab")
      
      // Update active tab button
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"))
      btn.classList.add("active")
      
      // Update active tab content
      document.querySelectorAll(".tab-content").forEach(content => {
        content.classList.remove("active")
      })
      document.getElementById(targetTab + "Orders").classList.add("active")
    })
  })
  
  // Modal close
  document.querySelector(".close").addEventListener("click", () => {
    document.getElementById("busModal").style.display = "none"
  })
  
  window.addEventListener("click", (e) => {
    if (e.target === document.getElementById("busModal")) {
      document.getElementById("busModal").style.display = "none"
    }
  })
}

function enterApp() {
  document.getElementById("mainApp").classList.add("visible")
  updateUserInterface()
  initializeMap()
}

function updateUserInterface() {
  if (currentUser) {
    // Update header
    const userName = document.getElementById("userName")
    const userAvatar = document.getElementById("userAvatar")
    
    userName.textContent = currentUser.name.split(' ')[0]
    userAvatar.textContent = currentUser.name.charAt(0).toUpperCase()
    
    // Update profile section
    document.getElementById("profileName").textContent = currentUser.name
    document.getElementById("profileEmail").textContent = currentUser.email
    document.getElementById("profileAvatar").textContent = currentUser.name.charAt(0).toUpperCase()
    document.getElementById("profilePhone").textContent = "***"
    document.getElementById("sharedCount").textContent = currentUser.sharedCount || 0
    document.getElementById("receivedCount").textContent = currentUser.receivedCount || 0
  }
}

function logout() {
  localStorage.removeItem('currentUser')
  currentUser = null
  
  showNotification("Çıkış yapıldı!", "success")
  
  setTimeout(() => {
    window.location.href = 'welcome-screen.html'
  }, 1000)
}

function editProfile() {
  showNotification("Profil düzenleme özelliği yakında eklenecek!", "success")
}

function showPhoneNumber() {
  if (currentUser && currentUser.phone) {
    const phoneElement = document.getElementById("profilePhone")
    if (phoneElement.textContent === "***") {
      phoneElement.textContent = currentUser.phone
    } else {
      phoneElement.textContent = "***"
    }
  }
}

function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll(".section").forEach(section => {
    section.classList.remove("active")
  })
  
  // Show target section
  document.getElementById(sectionId).classList.add("active")
  
  // Update bottom navigation
  document.querySelectorAll(".nav-item").forEach(item => {
    item.classList.remove("active")
  })
  
  // Set active nav item based on section
  const navMap = {
    'home': 0,
    'map': 1,
    'share': 2,
    'profile': 3,
    'find': 0, // Goes to home nav
    'track': 0 // Goes to home nav
  }
  
  const navItems = document.querySelectorAll(".nav-item")
  if (navMap[sectionId] !== undefined) {
    navItems[navMap[sectionId]].classList.add("active")
  }
  
  // Initialize map when map section is shown
  if (sectionId === "map" && map) {
    setTimeout(() => {
      map.invalidateSize()
    }, 100)
  }
}

function initializeMap() {
  if (document.getElementById("leafletMap")) {
    map = L.map("leafletMap").setView([41.0082, 28.9784], 11)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map)

    // Add bus markers
    sampleBuses.forEach((bus) => {
      const icon = L.divIcon({
        className: "custom-bus-marker",
        html: `<div class="bus-marker ${bus.status}">
                       <i class="fas fa-bus"></i>
                     </div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      })

      const marker = L.marker([bus.lat, bus.lng], { icon })
        .addTo(map)
        .bindPopup(`
                  <div style="min-width: 200px;">
                      <h4>${bus.name}</h4>
                      <p><strong>Durum:</strong> ${bus.status === "active" ? "Aktif" : "Bakımda"}</p>
                      <p><strong>Adres:</strong> ${bus.address}</p>
                      <p><strong>Kapasite:</strong> ${bus.currentLoad}/${bus.capacity}</p>
                      <button onclick="showBusDetails(${bus.id})" class="btn btn-secondary btn-small" style="margin-top: 0.5rem;">
                          Detayları Gör
                      </button>
                  </div>
              `)
    })
  }
}

function handleShareForm(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const newFood = {
    id: currentFoods.length + 1,
    category: formData.get("category"),
    name: formData.get("productName"),
    quantity: formData.get("quantity"),
    expiryDate: formData.get("expiryDate"),
    notes: formData.get("notes") || "",
    busId: Math.floor(Math.random() * 3) + 1,
    status: "available",
  }

  currentFoods.push(newFood)
  
  // Update user stats
  if (currentUser) {
    currentUser.sharedCount = (currentUser.sharedCount || 0) + 1
    
    // Update in registered users array
    const userIndex = registeredUsers.findIndex(user => user.id === currentUser.id)
    if (userIndex !== -1) {
      registeredUsers[userIndex] = currentUser
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers))
    }
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser))
    updateUserInterface()
  }
  
  showNotification("Gıda başarıyla paylaşıldı!", "success")
  e.target.reset()

  // If we're on the find section, refresh the food list
  if (document.getElementById("find").classList.contains("active")) {
    displayFoods(currentFoods)
  }
}

function searchFoods() {
  const category = document.getElementById("searchCategory").value
  const product = document.getElementById("searchProduct").value.toLowerCase()

  const filteredFoods = currentFoods.filter((food) => {
    const matchesCategory = !category || food.category === category
    const matchesProduct = !product || food.name.toLowerCase().includes(product)
    return matchesCategory && matchesProduct && food.status === "available"
  })

  displayFoods(filteredFoods)
}

function displayFoods(foods) {
  const availableFoods = foods.filter((food) => food.status === "available")
  const foodList = document.getElementById("foodList")

  if (availableFoods.length === 0) {
    foodList.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                <p>Aradığınız kriterlerde gıda bulunamadı.</p>
            </div>
        `
    return
  }

  foodList.innerHTML = availableFoods
    .map((food) => {
      const bus = sampleBuses.find((b) => b.id === food.busId)
      const categoryNames = {
        meyve: "Meyve",
        sebze: "Sebze",
        et: "Et Ürünleri",
        sut: "Süt Ürünleri",
        tahil: "Tahıl Ürünleri",
        icecek: "İçecek",
        diger: "Diğer",
      }

      return `
            <div class="food-item">
                <div class="food-header">
                    <span class="food-category">${categoryNames[food.category]}</span>
                </div>
                <h3 class="food-name">${food.name}</h3>
                <div class="food-details">
                    <div class="food-detail">
                        <span>Miktar:</span>
                        <span>${food.quantity}</span>
                    </div>
                    <div class="food-detail">
                        <span>Son Kullanma:</span>
                        <span>${formatDate(food.expiryDate)}</span>
                    </div>
                    <div class="food-detail">
                        <span>Konum:</span>
                        <span>${bus ? bus.name : "Bilinmiyor"}</span>
                    </div>
                    ${food.notes ? `<div class="food-detail"><span>Not:</span><span>${food.notes}</span></div>` : ""}
                </div>
                <div class="food-actions">
                    <button onclick="reserveFood(${food.id})" class="btn btn-primary btn-small">
                        <i class="fas fa-hand-paper"></i>
                        Ben Alacağım
                    </button>
                    <button onclick="showBusLocation(${food.busId})" class="btn btn-secondary btn-small">
                        <i class="fas fa-map-marker-alt"></i>
                        Konum
                    </button>
                </div>
            </div>
        `
    })
    .join("")
}

function reserveFood(foodId) {
  const food = currentFoods.find((f) => f.id === foodId)
  if (food) {
    food.status = "reserved"

    const bus = sampleBuses.find((b) => b.id === food.busId)
    currentOrders.taken.push({
      id: Date.now(),
      foodName: food.name,
      quantity: food.quantity,
      status: "pending",
      date: new Date().toISOString().split("T")[0],
      busName: bus ? bus.name : "Bilinmiyor",
    })

    // Update user stats
    if (currentUser) {
      currentUser.receivedCount = (currentUser.receivedCount || 0) + 1
      
      // Update in registered users array
      const userIndex = registeredUsers.findIndex(user => user.id === currentUser.id)
      if (userIndex !== -1) {
        registeredUsers[userIndex] = currentUser
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers))
      }
      
      localStorage.setItem('currentUser', JSON.stringify(currentUser))
      updateUserInterface()
    }

    showNotification("Gıda başarıyla ayırtıldı!", "success")
    searchFoods()
    displayOrders()
  }
}

function showBusLocation(busId) {
  const bus = sampleBuses.find((b) => b.id === busId)
  if (bus && map) {
    showSection("map")

    setTimeout(() => {
      map.setView([bus.lat, bus.lng], 15)
      map.eachLayer((layer) => {
        if (layer.getPopup && layer.getPopup()) {
          const popupContent = layer.getPopup().getContent()
          if (popupContent.includes(bus.name)) {
            layer.openPopup()
          }
        }
      })
    }, 200)
  }
}

function showBusDetails(busId) {
  const bus = sampleBuses.find((b) => b.id === busId)
  const busFoods = currentFoods.filter((f) => f.busId === busId && f.status === "available")

  if (bus) {
    document.getElementById("modalBusName").textContent = bus.name
    document.getElementById("modalBusContent").innerHTML = `
            <div>
                <p><strong>Durum:</strong> ${bus.status === "active" ? "Aktif" : "Bakımda"}</p>
                <p><strong>Adres:</strong> ${bus.address}</p>
                <p><strong>Kapasite:</strong> ${bus.currentLoad}/${bus.capacity}</p>
                <h4 style="margin: 1rem 0;">Mevcut Gıdalar (${busFoods.length} adet):</h4>
                <div>
                    ${
                      busFoods.length > 0
                        ? busFoods
                            .map(
                              (food) => `
                        <div style="padding: 0.5rem; border-bottom: 1px solid #eee;">
                            <strong>${food.name}</strong> - ${food.quantity}
                            <br><small>Son kullanma: ${formatDate(food.expiryDate)}</small>
                        </div>
                    `,
                            )
                            .join("")
                        : "<p>Bu otobüste şu anda gıda bulunmuyor.</p>"
                    }
                </div>
            </div>
        `
    document.getElementById("busModal").style.display = "block"
  }
}

function displayOrders() {
  displayGivenOrders()
  displayTakenOrders()
}

function displayGivenOrders() {
  const container = document.getElementById("givenOrders")
  const orders = currentOrders.given

  if (orders.length === 0) {
    container.innerHTML = "<p>Henüz paylaştığınız gıda bulunmuyor.</p>"
    return
  }

  container.innerHTML = orders
    .map(
      (order) => `
        <div class="order-item">
            <div class="order-header">
                <h4>${order.foodName}</h4>
                <span class="order-status status-${order.status}">
                    ${getStatusText(order.status)}
                </span>
            </div>
            <div class="order-details">
                <p><strong>Miktar:</strong> ${order.quantity}</p>
                <p><strong>Tarih:</strong> ${formatDate(order.date)}</p>
                <p><strong>Otobüs:</strong> ${order.busName}</p>
            </div>
        </div>
    `,
    )
    .join("")
}

function displayTakenOrders() {
  const container = document.getElementById("takenOrders")
  const orders = currentOrders.taken

  if (orders.length === 0) {
    container.innerHTML = "<p>Henüz aldığınız gıda bulunmuyor.</p>"
    return
  }

  container.innerHTML = orders
    .map(
      (order) => `
        <div class="order-item">
            <div class="order-header">
                <h4>${order.foodName}</h4>
                <span class="order-status status-${order.status}">
                    ${getStatusText(order.status)}
                </span>
            </div>
            <div class="order-details">
                <p><strong>Miktar:</strong> ${order.quantity}</p>
                <p><strong>Tarih:</strong> ${formatDate(order.date)}</p>
                <p><strong>Otobüs:</strong> ${order.busName}</p>
                ${order.status === "ready" ? '<p class="ready-message"><i class="fas fa-info-circle"></i> Gıdanız hazır! Otobüsten teslim alabilirsiniz.</p>' : ""}
            </div>
        </div>
    `,
    )
    .join("")
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("tr-TR")
}

function getStatusText(status) {
  const statusTexts = {
    pending: "Beklemede",
    confirmed: "Onaylandı",
    ready: "Hazır",
    completed: "Tamamlandı",
  }
  return statusTexts[status] || status
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