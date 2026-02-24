import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Plus, Search, FileText, Trash2, Edit } from 'lucide-react'

interface AutoInvoice {
  uid: string
  dateOfMonth: number
  client: string
  price: number
  typeOfPayment: number
  unpaid: number
}

interface ApiResponse {
  automaticInvoices: AutoInvoice[]
}

const documentTabs = [
  { path: '/documents', label: 'ПРОДАЖБИ', icon: 'sales' },
  { path: '/expenses', label: 'РАЗХОДИ', icon: 'package' },
  { path: '/auto-invoice', label: 'АВТОМАТИЧНИ ТАКСУВАНИЯ', icon: 'repeat' },
  { path: '/offers', label: 'ОФЕРТИ', icon: 'mail' },
  { path: '/waybills', label: 'ТОВАРИТЕЛНИЦИ', icon: 'mail' },
]

export function AutoInvoices() {
  const location = useLocation()
  const [autoInvoices, setAutoInvoices] = useState<AutoInvoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5001/automaticInvoices')
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data: ApiResponse = await response.json()
        setAutoInvoices(data.automaticInvoices)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleDelete = async (id: string) => {
    if (!window.confirm('Сигурни ли сте, че искате да изтриете тази такса?')) {
      return
    }
    try {
      const response = await fetch(`http://localhost:5001/deleteAutoInvoice?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      setAutoInvoices((prevInvoices) => prevInvoices.filter((invoice) => invoice.uid !== id))
    } catch (error) {
      console.error('Error deleting invoice:', error)
    }
  }

  const getPaymentType = (type: number) => {
    switch (type) {
      case 0:
        return 'В брой'
      case 1:
        return 'По банка'
      default:
        return 'Unknown'
    }
  }

  const filteredInvoices = autoInvoices.filter((invoice) =>
    invoice.client.toLowerCase().includes(searchTerm.toLowerCase())
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
        {documentTabs.map((tab) => (
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
        {/* Main Content Area */}
        <div className="documents__main documents__main--full">
          {/* Header with Title and Actions */}
          <div className="documents__header">
            <div className="documents__header-left">
              <span className="documents__title">Автоматични такси</span>
              <span className="documents__count">({autoInvoices.length})</span>
            </div>

            <div className="documents__header-right">
              <Link to="/auto-invoice-add">
                <Button className="documents__btn-add">
                  <Plus />
                  Добавяне на такса
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
                  <th style={{ width: '3%' }}>Номер</th>
                  <th>Дата в месеца</th>
                  <th>Клиент</th>
                  <th>Стойност</th>
                  <th>Тип на плащане</th>
                  <th>Брой неплатени</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.uid}>
                    <td>{invoice.uid}</td>
                    <td>{invoice.dateOfMonth}</td>
                    <td>{invoice.client}</td>
                    <td>{invoice.price.toFixed(2)} лв</td>
                    <td>{getPaymentType(invoice.typeOfPayment)}</td>
                    <td>{invoice.unpaid}</td>
                    <td>
                      <div className="documents__actions">
                        <button className="documents__action-btn">
                          <Edit />
                        </button>
                        <button 
                          className="documents__action-btn documents__action-btn--delete"
                          onClick={() => handleDelete(invoice.uid)}
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
                    <span>Общо такси: {autoInvoices.length}</span>
                  </td>
                  <td colSpan={2}>
                    <span>Тотал: {autoInvoices.reduce((sum, inv) => sum + inv.price, 0).toFixed(2)} лв.</span>
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
