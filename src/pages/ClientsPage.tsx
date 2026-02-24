import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Plus, Search, Trash2, Edit, Package } from 'lucide-react'

interface Client {
  uid: string
  firmName: string
  mol: string
  clientType: number
  eik: string
}

interface ApiResponse {
  clients: Client[]
}

export function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5001/clients')
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data: ApiResponse = await response.json()
        setClients(data.clients)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleDelete = async (id: string) => {
    if (!window.confirm('Сигурни ли сте, че искате да изтриете този клиент?')) {
      return
    }
    try {
      const response = await fetch(`http://localhost:5001/deleteClients?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      setClients((prevClients) => prevClients.filter((client) => client.uid !== id))
    } catch (error) {
      console.error('Error deleting client:', error)
    }
  }

  const getClientType = (type: number) => {
    switch (type) {
      case 0:
        return 'Частно лице'
      case 1:
        return 'Фирма'
      default:
        return 'Unknown'
    }
  }

  const filteredClients = clients.filter((client) =>
    client.firmName.toLowerCase().includes(searchTerm.toLowerCase())
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
      <div className="documents__container">
        <div className="documents__main documents__main--full">
          {/* Header with Title and Actions */}
          <div className="documents__header">
            <div className="documents__header-left">
              <span className="documents__title">Клиенти</span>
              <span className="documents__count">({clients.length})</span>
            </div>

            <div className="documents__header-right">
              <Link to="/add-clients">
                <Button className="documents__btn-add">
                  <Plus />
                  Добавяне на Клиент
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
                  <th>МОЛ</th>
                  <th>Тип</th>
                  <th>ЕИК/ЕГН</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client, index) => (
                  <tr key={client.uid}>
                    <td>{index + 1}</td>
                    <td>{client.firmName}</td>
                    <td>{client.mol}</td>
                    <td>{getClientType(client.clientType)}</td>
                    <td>{client.eik}</td>
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
                          onClick={() => handleDelete(client.uid)}
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
                    <span>Общо клиенти: {clients.length}</span>
                  </td>
                  <td colSpan={1}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
