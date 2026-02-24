import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

interface Storage {
  uid: number
  storageName: string
}

export function AddStoreHouseParts() {
  const navigate = useNavigate()
  const [storages, setStorages] = useState<Storage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [itemNum, setItemNum] = useState('')
  const [itemName, setItemName] = useState('')
  const [availability, setAvailability] = useState('')
  const [storageType, setStorageType] = useState('0')
  const [type, setType] = useState('0')
  const [position, setPosition] = useState('')
  const [selectedStorage, setSelectedStorage] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5001/storage')
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data = await response.json()
        setStorages(data.storage)
        if (data.storage.length > 0) {
          setSelectedStorage(data.storage[0].uid)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleClick = async () => {
    try {
      const response = await fetch('http://localhost:5001/addItems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storageItems: {
            itemNum: itemNum,
            itemName: itemName,
            Availability: availability,
            storageType: storageType,
            type: type,
            position: position,
            storage_id: selectedStorage,
          },
        }),
      })

      const result = await response.json()
      console.log(result)
      navigate('/storeHouseParts')
    } catch (error) {
      console.error('Error:', error)
    }
  }

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
    <div className="add-invoice">
      <div className="add-invoice__container">
        <div className="add-invoice__header">
          <span>Добавяне на артикул</span>
        </div>

        <div className="add-invoice__form">
          <div className="add-invoice__section">
            <h3 className="add-invoice__section-title">Тип на складов артикул</h3>
            <div className="add-invoice__row">
              <div className="add-invoice__field">
                <label>Складов тип</label>
                <select value={storageType} onChange={(e) => setStorageType(e.target.value)}>
                  <option value="0">Складов</option>
                  <option value="1">Реален</option>
                </select>
              </div>

              <div className="add-invoice__field">
                <label>Количество</label>
                <input
                  type="number"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div className="add-invoice__section">
            <h3 className="add-invoice__section-title">Основна информация</h3>
            <div className="add-invoice__row">
              <div className="add-invoice__field">
                <label>Име артикул</label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="Име на артикул"
                />
              </div>

              <div className="add-invoice__field">
                <label>Артикул номер</label>
                <input
                  type="text"
                  value={itemNum}
                  onChange={(e) => setItemNum(e.target.value)}
                  placeholder="Номер"
                />
              </div>

              <div className="add-invoice__field">
                <label>Тип артикул</label>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="0">Производство</option>
                  <option value="1">Части</option>
                </select>
              </div>

              <div className="add-invoice__field">
                <label>Позиция</label>
                <input
                  type="text"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="Позиция"
                />
              </div>
            </div>
          </div>

          <div className="add-invoice__section">
            <h3 className="add-invoice__section-title">Складова информация</h3>
            <div className="add-invoice__row">
              <div className="add-invoice__field">
                <label>Склад</label>
                <select value={selectedStorage} onChange={(e) => setSelectedStorage(e.target.value)}>
                  {storages.map((storage) => (
                    <option key={storage.uid} value={storage.uid}>
                      {storage.storageName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="add-invoice__footer">
          <Button onClick={handleClick} className="add-invoice__btn-add">
            Запис
          </Button>
          <Link to="/storeHouseParts">
            <Button variant="outline" className="add-invoice__btn-back">
              Назад
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
