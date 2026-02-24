import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Plus, Search, FileText, Trash2, Edit, Package } from 'lucide-react'
import { getBadgeClass, getBadgeText } from '@/lib/badge-utils'

interface Repair {
  uid: string
  client: string
  arrivalDate: string
  shipmentNum: string
  sentDate: string
  outgoingShipmentNum: string
  Articles: string
  state: number
}

interface ApiResponse {
  repairs: Repair[]
}

const orderTabs = [
  { path: '/orders', label: 'ПОРЪЧКИ' },
  { path: '/repairs', label: 'РЕМОНТИ' },
]

export function Repairs() {
  const location = useLocation()
  const [repairs, setRepairs] = useState<Repair[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5001/repairs')
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data: ApiResponse = await response.json()
        setRepairs(data.repairs)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleDelete = async (id: string) => {
    if (!window.confirm('Сигурни ли сте, че искате да изтриете тази поправка?')) {
      return
    }
    try {
      const response = await fetch(`http://localhost:5001/deleteRepair?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      setRepairs((prevRepairs) => prevRepairs.filter((repair) => repair.uid !== id))
    } catch (error) {
      console.error('Error deleting repair:', error)
    }
  }

  const getStatusBadge = (state: number) => {
    return <span className={getBadgeClass(state)}>{getBadgeText(state)}</span>
  }

  const filteredRepairs = repairs.filter((repair) =>
    repair.client.toLowerCase().includes(searchTerm.toLowerCase())
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
              <span className="documents__title">Ремонти</span>
              <span className="documents__count">({repairs.length})</span>
            </div>

            <div className="documents__header-right">
              <Link to="/add-repair">
                <Button className="documents__btn-add">
                  <Plus />
                  Добавяне на ремонт
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
                  <th>Приет на</th>
                  <th>Вх. товарителница</th>
                  <th>Изпратен на</th>
                  <th>Изх. товарителница</th>
                  <th>Артикули</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredRepairs.map((repair, index) => (
                  <tr key={repair.uid}>
                    <td>{index + 1}</td>
                    <td>{repair.client}</td>
                    <td>{repair.arrivalDate}</td>
                    <td>{repair.shipmentNum}</td>
                    <td>{repair.sentDate}</td>
                    <td>{repair.outgoingShipmentNum}</td>
                    <td>{repair.Articles}</td>
                    <td>{getStatusBadge(repair.state)}</td>
                    <td>
                      <div className="documents__actions">
                        <button className="documents__action-btn">
                          <Edit />
                        </button>
                        <button className="documents__action-btn">
                          <Package />
                        </button>
                        <button
                          className="documents__action-btn documents__action-btn--delete"
                          onClick={() => handleDelete(repair.uid)}
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
                  <td colSpan={7} style={{ textAlign: 'left' }}>
                    <span>Общо ремонти: {repairs.length}</span>
                  </td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
