import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

interface RepairArticle {
  id: number
  serialNum: string
}

export function AddRepairs() {
  const navigate = useNavigate()
  const [client, setClient] = useState('')
  const [arrivalDate, setArrivalDate] = useState('')
  const [shipmentNum, setShipmentNum] = useState('')
  const [repairArticles, setRepairArticles] = useState<RepairArticle[]>([
    { id: 1, serialNum: '' }
  ])

  const handleClick = async () => {
    try {
      const response = await fetch('http://localhost:5001/addRepair', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repairs: {
            client: client,
            arrivalDate: arrivalDate,
            shipmentNum: shipmentNum,
            sentDate: '',
            outgoingShipmentNum: '',
            Articles: 0,
            state: 0,
            serialNum: '',
            repairArticles: repairArticles,
          },
        }),
      })

      const result = await response.json()
      console.log(result)
      navigate('/repairs')
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleInputChange = (id: number, e: React.ChangeEvent<HTMLInputElement>, index: number, key: keyof RepairArticle) => {
    let updatedRepairs = repairArticles.map((item) =>
      item.id === id ? { ...item, [key]: e.target.value } : item
    )

    if (index === repairArticles.length - 1 && e.target.value !== '') {
      updatedRepairs = [
        ...updatedRepairs,
        {
          id: repairArticles.length + 1,
          serialNum: '',
        },
      ]
    }

    setRepairArticles(updatedRepairs)
  }

  const handleDeleteRow = (id: number) => {
    setRepairArticles(repairArticles.filter((item) => item.id !== id))
  }

  return (
    <div className="add-invoice">
      <div className="add-invoice__container">
        <div className="add-invoice__header">
          <span>Добавяне на ремонт</span>
        </div>

        <div className="add-invoice__form">
          <div className="add-invoice__row">
            <div className="add-invoice__field add-invoice__field--large">
              <label>Клиент</label>
              <input
                type="text"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                placeholder="Име на клиент"
              />
            </div>

            <div className="add-invoice__field">
              <label>Дата на пристигане</label>
              <input
                type="text"
                value={arrivalDate}
                onChange={(e) => setArrivalDate(e.target.value)}
                placeholder="дд.мм.гггг"
              />
            </div>

            <div className="add-invoice__field">
              <label>Входна товарителница</label>
              <input
                type="text"
                value={shipmentNum}
                onChange={(e) => setShipmentNum(e.target.value)}
                placeholder="Номер"
              />
            </div>
          </div>
        </div>

        <div className="add-invoice__table-container">
          <table className="add-invoice__table">
            <thead>
              <tr>
                <th style={{ width: '5%' }}>№</th>
                <th style={{ width: '85%' }}>Сериен номер</th>
                <th style={{ width: '10%' }}></th>
              </tr>
            </thead>
            <tbody>
              {repairArticles.map((repair, index) => (
                <tr key={repair.id}>
                  <td>{repair.id}</td>
                  <td>
                    <input
                      type="text"
                      value={repair.serialNum}
                      onChange={(e) => handleInputChange(repair.id, e, index, 'serialNum')}
                      placeholder="Въведете сериен номер"
                    />
                  </td>
                  <td>
                    {index !== 0 && (
                      <button
                        className="documents__action-btn documents__action-btn--delete"
                        onClick={() => handleDeleteRow(repair.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="add-invoice__footer">
          <Button onClick={handleClick} className="add-invoice__btn-add">
            Добавяне
          </Button>
          <Link to="/repairs">
            <Button variant="outline" className="add-invoice__btn-back">
              Назад
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
