import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Plus, Search, FileText, Trash2, Edit, Printer, Package } from 'lucide-react'
import { getBadgeClass, getBadgeText } from '@/lib/badge-utils'

interface Offer {
  uid: string
  dateOfOffer: string
  heading: string
  clientName: string
  price: number
  typeOfOffer: number
  state: number
}

interface ApiResponse {
  offers: Offer[]
}

const documentTabs = [
  { path: '/documents', label: 'ПРОДАЖБИ', icon: 'sales' },
  { path: '/expenses', label: 'РАЗХОДИ', icon: 'package' },
  { path: '/auto-invoice', label: 'АВТОМАТИЧНИ ТАКСУВАНИЯ', icon: 'repeat' },
  { path: '/offers', label: 'ОФЕРТИ', icon: 'mail' },
  { path: '/waybills', label: 'ТОВАРИТЕЛНИЦИ', icon: 'mail' },
]

export function Offers() {
  const location = useLocation()
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5001/offers')
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data: ApiResponse = await response.json()
        setOffers(data.offers)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleDelete = async (id: string) => {
    if (!window.confirm('Сигурни ли сте, че искате да изтриете тази оферта?')) {
      return
    }
    try {
      const response = await fetch(`http://localhost:5001/deleteOffers?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      setOffers((prevOffers) => prevOffers.filter((offer) => offer.uid !== id))
    } catch (error) {
      console.error('Error deleting offer:', error)
    }
  }

  const getStatusBadge = (state: number) => {
    return <span className={getBadgeClass(state)}>{getBadgeText(state)}</span>
  }

  const getOfferType = (type: number) => {
    switch (type) {
      case 0:
        return 'Фактура'
      case 1:
        return 'Проформа фактура'
      default:
        return 'Unknown'
    }
  }

  const filteredOffers = offers.filter((offer) =>
    offer.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalOffersValue = offers.reduce((sum, offer) => sum + offer.price, 0)

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
              <span className="documents__title">Оферти</span>
              <span className="documents__count">({offers.length})</span>
            </div>

            <div className="documents__header-right">
              <Link to="/add-offer">
                <Button className="documents__btn-add">
                  <Plus />
                  Добавяне на оферта
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
                  <th>Дата</th>
                  <th>Заглавие</th>
                  <th>Клиент</th>
                  <th>Стойност</th>
                  <th>Тип</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredOffers.map((offer, index) => (
                  <tr key={offer.uid}>
                    <td>{index + 1}</td>
                    <td>{offer.dateOfOffer}</td>
                    <td>{offer.heading}</td>
                    <td>{offer.clientName}</td>
                    <td>{offer.price.toFixed(2)} лв</td>
                    <td>{getOfferType(offer.typeOfOffer)}</td>
                    <td>{getStatusBadge(offer.state)}</td>
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
                          onClick={() => handleDelete(offer.uid)}
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
                    <span>Общо оферти: {offers.length}</span>
                  </td>
                  <td colSpan={3}>
                    <span>Тотал: {totalOffersValue.toFixed(2)} лв.</span>
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
