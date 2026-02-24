import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Plus, Search, FileText, Printer, Trash2, Edit, Package } from 'lucide-react'
import { getBadgeClass, getBadgeText } from '@/lib/badge-utils'

interface IncomingInvoice {
  uid: string
  date: string
  supplier: string
  invoiceValue: number
  expDate: string
  State: number
}

interface ApiResponse {
  incomingInvoices: IncomingInvoice[]
}

const documentTabs = [
  { path: '/documents', label: 'ПРОДАЖБИ', icon: 'sales' },
  { path: '/expenses', label: 'РАЗХОДИ', icon: 'package' },
  { path: '/auto-invoice', label: 'АВТОМАТИЧНИ ТАКСУВАНИЯ', icon: 'repeat' },
  { path: '/offers', label: 'ОФЕРТИ', icon: 'mail' },
  { path: '/waybills', label: 'ТОВАРИТЕЛНИЦИ', icon: 'mail' },
]

export function Expenses() {
  const location = useLocation()
  const [incomingInvoices, setIncomingInvoices] = useState<IncomingInvoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5001/incomingInvoices')
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data: ApiResponse = await response.json()
        setIncomingInvoices(data.incomingInvoices)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleDelete = async (id: string) => {
    if (!window.confirm('Сигурни ли сте, че искате да изтриете тази фактура?')) {
      return
    }
    try {
      const response = await fetch(`http://localhost:5001/deleteIncomingInvoices?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      setIncomingInvoices((prevInvoices) => prevInvoices.filter((invoice) => invoice.uid !== id))
    } catch (error) {
      console.error('Error deleting invoice:', error)
    }
  }

  const getStatusBadge = (state: number) => {
    return <span className={getBadgeClass(state)}>{getBadgeText(state)}</span>
  }

  const filteredInvoices = incomingInvoices.filter((invoice) =>
    invoice.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalIncomingValue = incomingInvoices.reduce((sum, invoice) => sum + invoice.invoiceValue, 0)

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
        {/* Main Content Area (No left sidebar for Expenses) */}
        <div className="documents__main documents__main--full">
          {/* Header with Title and Actions */}
          <div className="documents__header">
            <div className="documents__header-left">
              <span className="documents__title">Входящи фактури</span>
              <span className="documents__count">({incomingInvoices.length})</span>
            </div>

            <div className="documents__header-right">
              <Link to="/add-incoming-invoice">
                <Button className="documents__btn-add">
                  <Plus />
                  Добавяне на фактура
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
                  <th>Дата на фактурата</th>
                  <th>Доставчик</th>
                  <th>Стойност</th>
                  <th>Дата на изтичане</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice, index) => (
                  <tr key={invoice.uid}>
                    <td>{index + 1}</td>
                    <td>{invoice.date}</td>
                    <td>{invoice.supplier}</td>
                    <td>{invoice.invoiceValue.toFixed(2)} лв</td>
                    <td>{invoice.expDate}</td>
                    <td>{getStatusBadge(invoice.State)}</td>
                    <td>
                      <div className="documents__actions">
                        <button className="documents__action-btn">
                          <Edit />
                        </button>
                        <button className="documents__action-btn">
                          <Printer />
                        </button>
                        <button className="documents__action-btn">
                          <Package />
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
                    <span>Общо фактури: {incomingInvoices.length}</span>
                  </td>
                  <td colSpan={2}>
                    <span>Тотал: {totalIncomingValue.toFixed(2)} лв.</span>
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
