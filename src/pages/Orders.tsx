import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Plus, Search, FileText, Trash2, Menu } from 'lucide-react'

interface Order {
  uid: string
  client: string
  dateApplied: string
  dateSent: string
  outgoingShipmentNum: string
  price: number
  state: number
}

interface ApiResponse {
  orders: Order[]
}

const orderTabs = [
  { path: '/orders', label: 'ПОРЪЧКИ' },
  { path: '/repairs', label: 'РЕМОНТИ' },
]

export function Orders() {
  const location = useLocation()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5001/orders')
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data: ApiResponse = await response.json()
        setOrders(data.orders)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleDelete = async (id: string) => {
    if (!window.confirm('Сигурни ли сте, че искате да изтриете тази поръчка?')) {
      return
    }
    try {
      const response = await fetch(`http://localhost:5001/deleteOrder?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      setOrders((prevOrders) => prevOrders.filter((order) => order.uid !== id))
    } catch (error) {
      console.error('Error deleting order:', error)
    }
  }

  const getOrderStatus = (state: number) => {
    switch (state) {
      case 0:
        return <span className="badge badge--waiting">ЧАКА ИЗПРАЩАНЕ</span>
      case 1:
        return <span className="badge badge--paid">ИЗПРАТЕНА</span>
      case 2:
        return <span className="badge badge--missed">НЕИЗПРАТЕНА</span>
      default:
        return <span className="badge badge--default">Очаква статус</span>
    }
  }

  const filteredOrders = orders.filter((order) =>
    order.client.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="documents__loading">
        <p>Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="documents__error">
        <p>Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="documents">
      {/* Horizontal Navigation Tabs */}
      <div className="documents__nav">
        {orderTabs.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            className={`documents__nav-item ${location.pathname === tab.path ? 'documents__nav-item--active' : ''}`}
          >
            <FileText />
            <span>{tab.label}</span>
          </Link>
        ))}
      </div>

      <div className="documents__container">
        <div className="documents__main documents__main--full">
          {/* Header */}
          <div className="documents__header">
            <div className="documents__header-left">
              <span className="documents__title">Поръчки</span>
              <span className="documents__count">({orders.length})</span>
            </div>

            <div className="documents__header-right">
              <Link to="/add-order">
                <Button className="documents__btn-add">
                  <Plus />
                  Добавяне на поръчка
                </Button>
              </Link>

              <div className="documents__search">
                <Search />
                <input
                  type="text"
                  placeholder="Търсене"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="documents__table-container">
            <table className="documents__table">
              <thead>
                <tr>
                  <th style={{ width: '3%' }}>#</th>
                  <th>Клиент</th>
                  <th>Подадена на</th>
                  <th>Изпратен на</th>
                  <th>Изх. товарителница</th>
                  <th>Стойност</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => (
                  <tr key={order.uid}>
                    <td>{index + 1}</td>
                    <td>{order.client}</td>
                    <td>{order.dateApplied}</td>
                    <td>{order.dateSent}</td>
                    <td>{order.outgoingShipmentNum}</td>
                    <td>{order.price.toFixed(2)} лв.</td>
                    <td>{getOrderStatus(order.state)}</td>
                    <td>
                      <div className="documents__actions">
                        <button className="documents__action-btn">
                          <Menu />
                        </button>
                        <button
                          className="documents__action-btn documents__action-btn--delete"
                          onClick={() => handleDelete(order.uid)}
                        >
                          <Trash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={5} style={{ textAlign: 'left' }}>
                    <span>Общо поръчки: {orders.length}</span>
                  </td>
                  <td colSpan={3}>
                    <span>Тотал: {orders.reduce((sum, o) => sum + o.price, 0).toFixed(2)} лв.</span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
