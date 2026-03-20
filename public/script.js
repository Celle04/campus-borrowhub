document.addEventListener('DOMContentLoaded', () => {
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const equipment = bookingForm.equipment.value;
      const date = bookingForm.date.value;
      const resultDiv = document.getElementById('bookingResult');
      if (equipment && date) {
        resultDiv.textContent = `You successfully booked ${equipment} for ${date}.`;
      } else {
        resultDiv.textContent = 'Please select equipment and date.';
      }
    });
  }

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Simulate login success
      window.location.href = 'dashboard.html';
    });
  }

  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Simulate registration success
      window.location.href = 'login.html';
    });
  }

  // Load items for borrowing
  const itemsList = document.getElementById('itemsList');
  if (itemsList && !document.getElementById('addItemForm')) {
    loadBorrowItems();
  }

  // Load my borrowings
  const requestsList = document.getElementById('requestsList');
  const borrowingsList = document.getElementById('borrowingsList');
  if (requestsList && borrowingsList) {
    loadMyBorrowings();
  }

  // Admin items
  const addItemForm = document.getElementById('addItemForm');
  if (addItemForm) {
    addItemForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const description = document.getElementById('description').value;
      const category = document.getElementById('category').value;
      const totalQuantity = parseInt(document.getElementById('totalQuantity').value);
      try {
        const response = await fetch('/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, description, category, totalQuantity, availableQuantity: totalQuantity })
        });
        if (response.ok) {
          alert('Item added successfully!');
          loadAdminItems();
          addItemForm.reset();
          // Refresh borrow items page if it's open in another tab/window
          refreshBorrowItemsPage();
        } else {
          alert('Error adding item.');
        }
      } catch (error) {
        alert('Error adding item.');
      }
    });
    loadAdminItems();
  }

  // Admin requests
  if (requestsList && !borrowingsList) {
    loadAdminRequests();
  }

  async function loadBorrowItems() {
    try {
      const response = await fetch('/items');
      const items = await response.json();
      itemsList.innerHTML = items.map(item => `
        <div class="item">
          <h3>${item.name}</h3>
          <p>${item.description}</p>
          <p>Category: ${item.category}</p>
          <p>Available: ${item.availableQuantity}/${item.totalQuantity}</p>
          <button onclick="requestBorrow(${item.id})" ${item.availableQuantity <= 0 ? 'disabled' : ''}>Request Borrow</button>
        </div>
      `).join('') || '<p>No items available for borrowing.</p>';
    } catch (error) {
      itemsList.innerHTML = '<p>Error loading items.</p>';
    }
  }

  async function loadItems() {
    // Legacy function - now calls loadBorrowItems
    return loadBorrowItems();
  }

  async function loadAdminItems() {
    try {
      const response = await fetch('/items');
      const items = await response.json();
      itemsList.innerHTML = items.map(item => `
        <div class="item">
          <h3>${item.name}</h3>
          <p>${item.description}</p>
          <p>Category: ${item.category}</p>
          <p>Available: ${item.availableQuantity}/${item.totalQuantity}</p>
          <button onclick="deleteItem(${item.id})">Delete</button>
        </div>
      `).join('');
    } catch (error) {
      itemsList.innerHTML = '<p>Error loading items.</p>';
    }
  }

  async function loadAdminRequests() {
    try {
      const response = await fetch('/borrowings/requests');
      const requests = await response.json();

      // Calculate summary counts
      const today = new Date().toISOString().split('T')[0];
      const pendingCount = requests.filter(r => r.status === 'pending').length;
      const approvedTodayCount = requests.filter(r => r.status === 'approved' && r.requestDate === today).length;
      const rejectedTodayCount = requests.filter(r => r.status === 'rejected' && r.requestDate === today).length;

      // Update summary cards
      document.getElementById('pending-count').textContent = pendingCount;
      document.getElementById('approved-count').textContent = approvedTodayCount;
      document.getElementById('rejected-count').textContent = rejectedTodayCount;

      requestsList.innerHTML = requests.map(r => `
        <div class="request ${r.status}">
          <div class="request-header">
            <h3>Request #${r.id}</h3>
            <span class="status-badge status-${r.status}">${r.status}</span>
          </div>
          <div class="request-details">
            <p><strong>User ID:</strong> ${r.userId}</p>
            <p><strong>Item:</strong> ${r.item ? r.item.name : 'Unknown Item'}</p>
            <p><strong>Category:</strong> ${r.item ? r.item.category : 'N/A'}</p>
            <p><strong>Quantity:</strong> ${r.quantity}</p>
            <p><strong>Request Date:</strong> ${r.requestDate || 'N/A'}</p>
            ${r.status === 'approved' ? `<p><strong>Approved:</strong> Item quantity updated automatically</p>` : ''}
            ${r.status === 'rejected' ? `<p><strong>Reason:</strong> Request was rejected by admin</p>` : ''}
          </div>
          <div class="request-actions">
            ${r.status === 'pending' ? `
              <button onclick="approveRequest(${r.id})" class="approve-btn">Approve</button>
              <button onclick="rejectRequest(${r.id})" class="reject-btn">Reject</button>
            ` : ''}
          </div>
        </div>
      `).join('') || '<p>No requests found.</p>';
    } catch (error) {
      requestsList.innerHTML = '<p>Error loading requests.</p>';
    }
  }

  window.deleteItem = async function(id) {
    if (confirm('Delete this item?')) {
      try {
        const response = await fetch(`/items/${id}`, { method: 'DELETE' });
        if (response.ok) {
          alert('Item deleted!');
          loadAdminItems();
        } else {
          alert('Error deleting item.');
        }
      } catch (error) {
        alert('Error deleting item.');
      }
    }
  };

  window.approveRequest = async function(id) {
    try {
      const response = await fetch(`/borrowings/requests/${id}/approve`, { method: 'PUT' });
      if (response.ok) {
        alert('Request approved successfully! Item quantity has been updated.');
        loadAdminRequests();
        // Refresh borrow items page to show updated availability
        refreshBorrowItemsPage();
      } else {
        alert('Error approving request.');
      }
    } catch (error) {
      alert('Error approving request.');
    }
  };

  window.rejectRequest = async function(id) {
    try {
      const response = await fetch(`/borrowings/requests/${id}/reject`, { method: 'PUT' });
      if (response.ok) {
        alert('Request rejected successfully.');
        loadAdminRequests();
      } else {
        alert('Error rejecting request.');
      }
    } catch (error) {
      alert('Error rejecting request.');
    }
  };

  async function loadMyBorrowings() {
    try {
      const requestsResponse = await fetch('/borrowings/requests');
      const requests = await requestsResponse.json();
      requestsList.innerHTML = requests.filter(r => r.userId === 1).map(r => `
        <div class="request">
          <p>Item: ${r.item ? r.item.name : 'Unknown'}</p>
          <p>Quantity: ${r.quantity}</p>
          <p>Status: ${r.status}</p>
        </div>
      `).join('') || '<p>No requests.</p>';

      const borrowingsResponse = await fetch('/borrowings/user/1');
      const borrowings = await borrowingsResponse.json();
      borrowingsList.innerHTML = borrowings.map(b => `
        <div class="borrowing">
          <p>Item: ${b.item ? b.item.name : 'Unknown'}</p>
          <p>Quantity: ${b.quantity}</p>
          <p>Borrow Date: ${b.borrowDate}</p>
          <p>Due Date: ${b.dueDate}</p>
          <p>Status: ${b.status}</p>
          ${b.status === 'borrowed' ? `<button onclick="returnItem(${b.id})">Return</button>` : ''}
        </div>
      `).join('') || '<p>No borrowings.</p>';
    } catch (error) {
      requestsList.innerHTML = '<p>Error loading requests.</p>';
      borrowingsList.innerHTML = '<p>Error loading borrowings.</p>';
    }
  }

  window.requestBorrow = async function(itemId) {
    const quantity = prompt('Enter quantity to borrow:');
    if (quantity && quantity > 0) {
      try {
        const response = await fetch('/borrowings/request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: 1, itemId, quantity: parseInt(quantity), requestDate: new Date().toISOString().split('T')[0] })
        });
        if (response.ok) {
          alert('Borrow request submitted successfully!');
          loadBorrowItems(); // Refresh the items list to show updated availability
        } else {
          alert('Error submitting request.');
        }
      } catch (error) {
        alert('Error submitting request.');
      }
    }
  };

  // Function to refresh borrow items page (for cross-page updates)
  function refreshBorrowItemsPage() {
    // This function can be called to refresh items on the borrow page
    // In a real application, you might use localStorage, WebSockets, or server-sent events
    console.log('Item added - borrow items page should refresh');
  }

  window.returnItem = async function(id) {
    try {
      const response = await fetch(`/borrowings/return/${id}`, { method: 'POST' });
      if (response.ok) {
        alert('Item returned!');
        loadMyBorrowings();
      } else {
        alert('Error returning item.');
      }
    } catch (error) {
      alert('Error returning item.');
    }
  };

  // Dashboard functionality
  if (document.querySelector('.dashboard-header')) {
    loadDashboardData();
  }
});

// Dashboard functions
async function loadDashboardData() {
  try {
    // Load user stats
    await loadUserStats();

    // Load recent activity
    await loadRecentActivity();

    // Load current borrowings
    await loadCurrentBorrowings();

    // Load notifications
    await loadNotifications();
  } catch (error) {
    console.error('Error loading dashboard data:', error);
  }
}

async function loadUserStats() {
  try {
    // Simulate API calls - replace with actual API endpoints
    const stats = {
      activeBorrowings: 2,
      dueSoon: 1,
      returnedItems: 5,
      notifications: 3
    };

    document.getElementById('active-borrowings').textContent = stats.activeBorrowings;
    document.getElementById('due-soon').textContent = stats.dueSoon;
    document.getElementById('returned-items').textContent = stats.returnedItems;
    document.getElementById('notifications').textContent = stats.notifications;
  } catch (error) {
    console.error('Error loading user stats:', error);
  }
}

async function loadRecentActivity() {
  try {
    const activityList = document.getElementById('recent-activity-list');

    // Simulate recent activities - replace with actual API call
    const activities = [
      {
        icon: '📖',
        text: 'Borrowed "Laptop" for project work',
        time: '2 hours ago'
      },
      {
        icon: '✅',
        text: 'Returned "Camera" successfully',
        time: '1 day ago'
      },
      {
        icon: '📝',
        text: 'Submitted borrow request for "Projector"',
        time: '3 days ago'
      }
    ];

    activityList.innerHTML = activities.map(activity => `
      <div class="activity-item">
        <div class="activity-icon">${activity.icon}</div>
        <div class="activity-content">
          <p class="activity-text">${activity.text}</p>
          <span class="activity-time">${activity.time}</span>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading recent activity:', error);
  }
}

async function loadCurrentBorrowings() {
  try {
    const borrowingsList = document.getElementById('current-borrowings-list');

    // Simulate current borrowings - replace with actual API call
    const borrowings = [
      {
        id: 1,
        item: 'Laptop',
        dueDate: '2026-03-25',
        status: 'borrowed'
      },
      {
        id: 2,
        item: 'Camera',
        dueDate: '2026-03-22',
        status: 'due-soon'
      }
    ];

    if (borrowings.length === 0) {
      borrowingsList.innerHTML = '<p class="no-data">No active borrowings. <a href="book-equipment.html">Browse equipment</a> to get started.</p>';
    } else {
      borrowingsList.innerHTML = borrowings.map(borrowing => `
        <div class="borrowing-item ${borrowing.status === 'due-soon' ? 'due-soon' : ''}">
          <div class="borrowing-icon">📦</div>
          <div class="borrowing-content">
            <h4>${borrowing.item}</h4>
            <p>Due: ${new Date(borrowing.dueDate).toLocaleDateString()}</p>
            ${borrowing.status === 'due-soon' ? '<span class="due-warning">⚠️ Due Soon</span>' : ''}
          </div>
          <button class="return-btn" onclick="returnItem(${borrowing.id})">Return</button>
        </div>
      `).join('');
    }
  } catch (error) {
    console.error('Error loading current borrowings:', error);
  }
}

async function loadNotifications() {
  try {
    const notificationsList = document.getElementById('notifications-list');

    // Simulate notifications - replace with actual API call
    const notifications = [
      {
        icon: '⏰',
        text: 'Your "Camera" is due in 2 days',
        time: '2 hours ago',
        type: 'warning'
      },
      {
        icon: '✅',
        text: 'Borrow request for "Projector" approved',
        time: '1 day ago',
        type: 'success'
      },
      {
        icon: 'ℹ️',
        text: 'New equipment added: Wireless Microphone',
        time: '3 days ago',
        type: 'info'
      }
    ];

    notificationsList.innerHTML = notifications.map(notification => `
      <div class="notification-item ${notification.type}">
        <div class="notification-icon">${notification.icon}</div>
        <div class="notification-content">
          <p class="notification-text">${notification.text}</p>
          <span class="notification-time">${notification.time}</span>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading notifications:', error);
  }
}

// Utility function for returning items
function returnItem(borrowingId) {
  if (confirm('Are you sure you want to return this item?')) {
    // Simulate return - replace with actual API call
    alert('Item returned successfully!');
    loadDashboardData(); // Refresh dashboard
  }
}