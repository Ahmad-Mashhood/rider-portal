import React, { createContext, useContext, useReducer, useState } from 'react'
import { auth } from '../firebase'
import { signOut } from 'firebase/auth'

// ─── Initial Data ────────────────────────────────────────────────────────────

const INITIAL_ORDERS = [
  {
    id: 'FG-2045',
    restaurant: 'The Burger Joint',
    restaurantAddress: '45th Main, Central Plaza',
    customerAddress: '128 Oak Street, Apt 4B',
    distance: '2.4 km',
    payout: 15.50,
    borderClass: 'order-card-border',
    restaurantImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGBt_SNvzjOir_DrIiYa-s0xNegjaBzHiMp17lm8-VshQahQjqzwrEYEszg7yQ7LW38IipQJKdD4YZltw55AGB__3hoTdLhbxMMNEvYoihvyqGpHmHf2DAS_JtFyS7K68e6HeBDgSOpRXf1W-cwGIx_yF74rCG-6BZQP1MCeXMjxp8cBkaMzHOkcZo6P4EKxhJrB9BTcoe19Vr3JAONiyA3REE7dOWkhlEjdRJyfKdaRt-w-VcCM7iwjQC887Rmu_RrmI6pX9BqSO0',
    customer: { name: 'James Wilson', address: 'Apt 4B, 112 W 34th St' },
    estimatedTime: '8 mins',
  },
  {
    id: 'FG-2102',
    restaurant: 'Pasta House Express',
    restaurantAddress: 'Boutique Mall, North Wing',
    customerAddress: '782 Pine Avenue',
    distance: '1.8 km',
    payout: 11.20,
    borderClass: 'accent-card-border',
    restaurantImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGBt_SNvzjOir_DrIiYa-s0xNegjaBzHiMp17lm8-VshQahQjqzwrEYEszg7yQ7LW38IipQJKdD4YZltw55AGB__3hoTdLhbxMMNEvYoihvyqGpHmHf2DAS_JtFyS7K68e6HeBDgSOpRXf1W-cwGIx_yF74rCG-6BZQP1MCeXMjxp8cBkaMzHOkcZo6P4EKxhJrB9BTcoe19Vr3JAONiyA3REE7dOWkhlEjdRJyfKdaRt-w-VcCM7iwjQC887Rmu_RrmI6pX9BqSO0',
    customer: { name: 'Maria Chen', address: '782 Pine Avenue, Unit 5' },
    estimatedTime: '12 mins',
  },
  {
    id: 'FG-2198',
    restaurant: 'Burger Genie Central',
    restaurantAddress: '452 Broadway, Manhattan',
    customerAddress: 'Apt 4B, 112 W 34th St',
    distance: '3.1 km',
    payout: 18.00,
    borderClass: 'order-card-border',
    restaurantImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGBt_SNvzjOir_DrIiYa-s0xNegjaBzHiMp17lm8-VshQahQjqzwrEYEszg7yQ7LW38IipQJKdD4YZltw55AGB__3hoTdLhbxMMNEvYoihvyqGpHmHf2DAS_JtFyS7K68e6HeBDgSOpRXf1W-cwGIx_yF74rCG-6BZQP1MCeXMjxp8cBkaMzHOkcZo6P4EKxhJrB9BTcoe19Vr3JAONiyA3REE7dOWkhlEjdRJyfKdaRt-w-VcCM7iwjQC887Rmu_RrmI6pX9BqSO0',
    customer: { name: 'David Park', address: '45 Cedar Ave, Apt 2C' },
    estimatedTime: '15 mins',
  },
]

// ─── Auth Context ─────────────────────────────────────────────────────────────

export const AuthContext = createContext(null)

// ─── Order Context ────────────────────────────────────────────────────────────

export const OrderContext = createContext(null)

const orderInitialState = {
  orders: INITIAL_ORDERS,
  currentOrder: null,
}

function orderReducer(state, action) {
  switch (action.type) {
    case 'ACCEPT_ORDER':
      return {
        ...state,
        currentOrder: action.payload,
        orders: state.orders.filter(o => o.id !== action.payload.id),
      }
    case 'SKIP_ORDER':
      return {
        ...state,
        orders: state.orders.filter(o => o.id !== action.payload),
      }
    case 'CLEAR_CURRENT_ORDER':
      return { ...state, currentOrder: null }
    default:
      return state
  }
}

// ─── Delivery Context ─────────────────────────────────────────────────────────

export const DeliveryContext = createContext(null)

// Status machine: accepted → picked_up → on_the_way → delivered
const DELIVERY_STATUSES = ['accepted', 'picked_up', 'on_the_way', 'delivered']

const deliveryInitialState = {
  deliveryStatus: 'accepted',    // current step in the machine
  earnings: {
    today: 42.70,
    weekly: 450.20,
    monthly: 1820.00,
  },
  completedOrders: [
    { id: 'GH-9021', time: 'Today, 2:45 PM', amount: 16.50 },
    { id: 'GH-8944', time: 'Today, 1:12 PM', amount: 12.00 },
    { id: 'GH-8812', time: 'Yesterday, 8:30 PM', amount: 14.20 },
  ],
  totalDeliveries: 32,
  avgPerOrder: 14.00,
}

function deliveryReducer(state, action) {
  switch (action.type) {
    case 'ADVANCE_STATUS': {
      const currentIdx = DELIVERY_STATUSES.indexOf(state.deliveryStatus)
      const nextStatus = DELIVERY_STATUSES[Math.min(currentIdx + 1, DELIVERY_STATUSES.length - 1)]
      return { ...state, deliveryStatus: nextStatus }
    }
    case 'COMPLETE_DELIVERY': {
      const amount = action.payload.payout
      const newEntry = {
        id: action.payload.id,
        time: new Date().toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
        amount,
      }
      return {
        ...state,
        deliveryStatus: 'accepted',  // reset for next delivery
        earnings: {
          today: parseFloat((state.earnings.today + amount).toFixed(2)),
          weekly: parseFloat((state.earnings.weekly + amount).toFixed(2)),
          monthly: parseFloat((state.earnings.monthly + amount).toFixed(2)),
        },
        completedOrders: [{ ...newEntry, time: `Today, ${newEntry.time}` }, ...state.completedOrders],
        totalDeliveries: state.totalDeliveries + 1,
        avgPerOrder: parseFloat(
          ((state.avgPerOrder * state.totalDeliveries + amount) / (state.totalDeliveries + 1)).toFixed(2)
        ),
      }
    }
    case 'RESET_STATUS':
      return { ...state, deliveryStatus: 'accepted' }
    default:
      return state
  }
}

// ─── Combined Provider ────────────────────────────────────────────────────────

export function AppProvider({ children }) {
  // Auth
  const [rider, setRider] = useState(() => {
    const saved = localStorage.getItem('rider')
    if (saved) {
      const parsed = JSON.parse(saved)
      if (!parsed.area) parsed.area = 'Jinnah Shaheed Road, Vehari'
      return parsed
    }
    return null
  })
  const toggleOnline = () => setRider(r => {
    if (!r) return null
    const updated = { ...r, isOnline: !r.isOnline }
    localStorage.setItem('rider', JSON.stringify(updated))
    return updated
  })
  const logout = async () => {
    try {
      await signOut(auth)
    } catch (e) {}
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('rider')
    setRider(null)
    window.location.href = '/login'
  }

  // Notifications
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Welcome Rider!', message: 'Have a safe and happy delivery journey today.', time: 'Just now', unread: true },
    { id: 2, title: 'Tips Updated', message: 'You received a $3.00 tip for Order #2411.', time: '1 hr ago', unread: false },
    { id: 3, title: 'System Notice', message: 'High demand near Downtown. Double earnings active!', time: '2 hrs ago', unread: false }
  ])
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const markAllRead = () => setNotifications(notifs => notifs.map(n => ({ ...n, unread: false })))
  const addNotification = (title, message) => {
    setNotifications(prev => [
      { id: Date.now(), title, message, time: 'Just now', unread: true },
      ...prev
    ])
  }

  // Orders
  const [orderState, orderDispatch] = useReducer(orderReducer, orderInitialState)
  const acceptOrder = (order) => orderDispatch({ type: 'ACCEPT_ORDER', payload: order })
  const skipOrder = (id) => orderDispatch({ type: 'SKIP_ORDER', payload: id })
  const clearCurrentOrder = () => orderDispatch({ type: 'CLEAR_CURRENT_ORDER' })

  // Delivery
  const [deliveryState, deliveryDispatch] = useReducer(deliveryReducer, deliveryInitialState)
  const advanceStatus = () => deliveryDispatch({ type: 'ADVANCE_STATUS' })
  const completeDelivery = (order) => deliveryDispatch({ type: 'COMPLETE_DELIVERY', payload: order })
  const resetStatus = () => deliveryDispatch({ type: 'RESET_STATUS' })

  return (
    <AuthContext.Provider value={{ rider, setRider, toggleOnline, logout, notifications, isNotifOpen, setIsNotifOpen, markAllRead, addNotification }}>
      <OrderContext.Provider value={{ ...orderState, acceptOrder, skipOrder, clearCurrentOrder }}>
        <DeliveryContext.Provider value={{ ...deliveryState, advanceStatus, completeDelivery, resetStatus }}>
          {children}
        </DeliveryContext.Provider>
      </OrderContext.Provider>
    </AuthContext.Provider>
  )
}

// ─── Custom Hooks ─────────────────────────────────────────────────────────────

export const useAuth = () => useContext(AuthContext)
export const useOrders = () => useContext(OrderContext)
export const useDelivery = () => useContext(DeliveryContext)
