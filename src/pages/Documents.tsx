import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Plus, Search, FileText, Printer, Trash2, Edit, Package } from 'lucide-react'
import { getBadgeClass, getBadgeText } from '@/lib/badge-utils'

interface OutgoingInvoice {
  uid: string
  date: string
  type: number
  client: string
  invoiceValue: number
  typeOfPayment: number
  invoiceState: number
}

interface ApiResponse {
  outgoingInvoices: OutgoingInvoice[]
}

const documentTabs = [
  { path: '/documents', label: 'ПРОДАЖБИ', icon: 'sales' },
  { path: '/expenses', label: 'РАЗХОДИ', icon: 'package' },
  { path: '/auto-invoice', label: 'АВТОМАТИЧНИ ТАКСУВАНИЯ', icon: 'repeat' },
  { path: '/offers', label: 'ОФЕРТИ', icon: 'mail' },
  { path: '/waybills', label: 'ТОВАРИТЕЛНИЦИ', icon: 'mail' },
]

export function Documents() {
  const location = useLocation()
  const [outgoingInvoices, setOutgoingInvoices] = useState<OutgoingInvoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5001/outgoingInvoices')
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data: ApiResponse = await response.json()
        setOutgoingInvoices(data.outgoingInvoices)
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
      const response = await fetch(`http://localhost:5001/deleteOutgoingInvoices?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      setOutgoingInvoices((prevInvoices) => prevInvoices.filter((invoice) => invoice.uid !== id))
    } catch (error) {
      console.error('Error deleting invoice:', error)
    }
  }

  const getStatusBadge = (state: number) => {
    console.log('Invoice state:', state, 'Type:', typeof state)
    return <span className={getBadgeClass(state)}>{getBadgeText(state)}</span>
  }

  const getInvoiceType = (type: number) => {
    switch (type) {
      case 0:
        return 'Фактура'
      case 1:
        return 'Проформа фактура'
      default:
        return 'Unknown'
    }
  }

  const getPaymentType = (type: number) => {
    switch (type) {
      case 0:
        return 'Банков път'
      case 1:
        return 'В брой'
      case 2:
        return 'Пощенски паричен'
      default:
        return 'Unknown'
    }
  }

  const filteredInvoices = outgoingInvoices.filter((invoice) =>
    invoice.client.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalOutgoingValue = outgoingInvoices.reduce((sum, invoice) => sum + invoice.invoiceValue, 0)

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
        {/* Left Sidebar Filter */}
        {/* <div className="documents__sidebar">
          <div className="documents__sidebar-content">
            <span className="documents__sidebar-header">Тип Документ</span>
            <span className="documents__sidebar-item">Всички</span>
            <span className="documents__sidebar-item">Фактури</span>
            <span className="documents__sidebar-item documents__sidebar-item--active">Проформа фактури</span>
          </div>
        </div> */}

        {/* Main Content Area */}
        <div className="documents__main">
          {/* Header with Title and Actions */}
          <div className="documents__header">
            <div className="documents__header-left">
              <span className="documents__title">Изходящи фактури</span>
              <span className="documents__count">({outgoingInvoices.length})</span>
            </div>

            <div className="documents__header-right">
              <Button variant="outline" className="documents__btn-report">
                <Package />
                Справка
              </Button>

              <Link to="/add-invoice">
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
                  <th style={{ width: '3%' }}>#</th>
                  <th>Дата на издаване</th>
                  <th>Тип</th>
                  <th>Клиент</th>
                  <th>Стойност</th>
                  <th>Тип на плащане</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice, index) => (
                  <tr key={invoice.uid}>
                    <td>{index + 1}</td>
                    <td>{invoice.date}</td>
                    <td>{getInvoiceType(invoice.type)}</td>
                    <td>{invoice.client}</td>
                    <td>{invoice.invoiceValue.toFixed(2)} лв</td>
                    <td>{getPaymentType(invoice.typeOfPayment)}</td>
                    <td>{getStatusBadge(invoice.invoiceState)}</td>
                    <td>
                      <div className="documents__actions">
                        <button className="documents__action-btn">
                          <Edit />
                        </button>
                        <Link to={`/view-invoice?invoice_id=${invoice.uid}`}>
                          <button className="documents__action-btn">
                            <Printer />
                          </button>
                        </Link>
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
                  <td colSpan={6} style={{ textAlign: 'left' }}>
                    <span>Общо фактури: {outgoingInvoices.length}</span>
                  </td>
                  <td colSpan={2}>
                    <span>Тотал: {totalOutgoingValue.toFixed(2)} лв.</span>
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
