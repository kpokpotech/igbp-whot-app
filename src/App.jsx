import React from 'react'

export default function App({ children }) {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 16 }}>
      {children}
    </div>
  )
}