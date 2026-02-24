import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Plus, Search, FileText, Trash2, Edit, Package, X } from 'lucide-react'

interface Storage {
  uid: number
  storageName: string
  selected?: boolean
}

interface StorageItem {
  uid: string
  itemNum: string
  itemName: string
  Availability: number
  storageType: number
  type: number
  position: string
}

const storageTabs = [
  { path: '/suppliers', label: 'ДОСТАВЧИЦИ' },
  { path: '/storeHouseParts', label: 'СКЛАДОВЕ' },
  { path: '/production', label: 'ПРОИЗВОДСТВО' },
]

export function StoreHouseParts() {
  const location = useLocation()
  const [storages, setStorages] = useState<Storage[]>([])
  const [storageItems, setStorageItems] = useState<StorageItem[]>([])
  const [selectedStorage, setSelectedStorage] = useState<number>(0)
  const [isModalOpen, setIsModalOpen] = useState<{ open: boolean; item_id: string | null }>({ open: false, item_id: null })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchDataStorage = async () => {
      try {
        const response = await fetch('http://localhost:5001/storage')
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data = await response.json()
        const storageData = data.storage.map((s: Storage, index: number) => ({
          ...s,
          selected: index === 0,
        }))
        setStorages(storageData)
        if (storageData.length > 0) {
          setSelectedStorage(storageData[0].uid)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchDataStorage()
  }, [])

  useEffect(() => {
    if (selectedStorage !== 0 || storages.length > 0) {
      fetchStorageItemsOnSelect(selectedStorage)
    }
  }, [selectedStorage])

  const fetchStorageItemsOnSelect = async (storageId: number) => {
    try {
      const response = await fetch(`http://localhost:5001/storageItems?storage_id=${storageId}`)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      const data = await response.json()
      setStorageItems(data.storageItems)

      setStorages((prev) =>
        prev.map((s) => ({
          ...s,
          selected: s.uid === storageId,
        }))
      )
      setSelectedStorage(storageId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const refreshStorageItems = async () => {
    try {
      const response = await fetch(`http://localhost:5001/storageItems?storage_id=${selectedStorage}`)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      const data = await response.json()
      setStorageItems(data.storageItems)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Сигурни ли сте, че искате да изтриете този артикул?')) {
      return
    }
    try {
      const response = await fetch(`http://localhost:5001/deleteStorageItems?id=${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      setStorageItems((prev) => prev.filter((item) => item.uid !== id))
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  const handleDeleteStorage = async (storageId: number) => {
    if (!window.confirm('Сигурни ли сте, че искате да изтриете този склад?')) {
      return
    }
    try {
      const response = await fetch(`http://localhost:5001/deleteStorage?id=${storageId}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const remaining = storages.filter((s) => s.uid !== storageId)
      setStorages(remaining)

      if (selectedStorage === storageId && remaining.length > 0) {
        setSelectedStorage(remaining[0].uid)
        fetchStorageItemsOnSelect(remaining[0].uid)
      }
    } catch (error) {
      console.error('Error deleting storage:', error)
    }
  }

  const switchItemStorage = async (storageId: number) => {
    if (!isModalOpen.item_id) return
    try {
      const response = await fetch(
        `http://localhost:5001/updateStorageItemStorage?storage_id=${storageId}&item_id=${isModalOpen.item_id}`
      )
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      refreshStorageItems()
      setIsModalOpen({ open: false, item_id: null })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const getStorageType = (type: number) => {
    switch (type) {
      case 0:
        return 'Реален'
      case 1:
        return 'Виртуален'
      default:
        return 'Unknown'
    }
  }

  const getItemType = (type: number) => {
    switch (type) {
      case 0:
        return 'Производство'
      case 1:
        return 'Части'
      default:
        return 'Unknown'
    }
  }

  const filteredItems = storageItems.filter((item) =>
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const currentStorageName = storages.find((s) => s.uid === selectedStorage)?.storageName || ''

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
      {/* Modal for moving items */}
      {isModalOpen.open && (
        <div className="storehouse__modal-overlay" onClick={() => setIsModalOpen({ open: false, item_id: null })}>
          <div className="storehouse__modal" onClick={(e) => e.stopPropagation()}>
            <div className="storehouse__modal-header">
              <h3>Премести артикул в:</h3>
              <button
                className="storehouse__modal-close"
                onClick={() => setIsModalOpen({ open: false, item_id: null })}
              >
                <X />
              </button>
            </div>
            <div className="storehouse__modal-body">
              {storages.map((storage) => (
                <button
                  key={storage.uid}
                  className="storehouse__modal-item"
                  onClick={() => switchItemStorage(storage.uid)}
                >
                  {storage.storageName}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Horizontal Navigation Tabs */}
      <div className="documents__nav">
        {storageTabs.map((tab) => (
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
        {/* Left Sidebar - Storage List */}
        <div className="documents__sidebar">
          <div className="documents__sidebar-content">
            <span className="documents__sidebar-header">Складове</span>
            <span
              className={`documents__sidebar-item ${selectedStorage === -1 ? 'documents__sidebar-item--active' : ''}`}
              onClick={() => fetchStorageItemsOnSelect(-1)}
            >
              Неразпределени
            </span>
            {storages.map((storage) => (
              <span
                key={storage.uid}
                className={`documents__sidebar-item ${storage.selected ? 'documents__sidebar-item--active' : ''}`}
              >
                <span
                  style={{ flex: 1, cursor: 'pointer' }}
                  onClick={() => fetchStorageItemsOnSelect(storage.uid)}
                >
                  {storage.storageName}
                </span>
                <button
                  className="documents__action-btn documents__action-btn--delete"
                  onClick={() => handleDeleteStorage(storage.uid)}
                  style={{ padding: '2px' }}
                >
                  <Trash2 size={14} />
                </button>
              </span>
            ))}
            <Link to="/storeHouse" className="documents__sidebar-add">
              + Добави Склад
            </Link>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="documents__main">
          {/* Header */}
          <div className="documents__header">
            <div className="documents__header-left">
              <span className="documents__title">
                {currentStorageName ? `Склад - ${currentStorageName}` : 'Неразпределени'}
              </span>
            </div>

            <div className="documents__header-right">
              <Link to="/add-items">
                <Button className="documents__btn-add">
                  <Plus />
                  Добавяне
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
                  <th>Арт. номер</th>
                  <th>Име на компонент</th>
                  <th>Наличност</th>
                  <th>Складов тип</th>
                  <th>Тип</th>
                  <th>Позиция</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item, index) => (
                  <tr key={item.uid}>
                    <td>{index + 1}</td>
                    <td>{item.itemNum}</td>
                    <td>{item.itemName}</td>
                    <td>{item.Availability}</td>
                    <td>{getStorageType(item.storageType)}</td>
                    <td>{getItemType(item.type)}</td>
                    <td>{item.position}</td>
                    <td>
                      <div className="documents__actions">
                        <button
                          className="documents__action-btn"
                          onClick={() => setIsModalOpen({ open: true, item_id: item.uid })}
                        >
                          <Edit />
                        </button>
                        <button className="documents__action-btn">
                          <Package />
                        </button>
                        <button
                          className="documents__action-btn documents__action-btn--delete"
                          onClick={() => handleDelete(item.uid)}
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
                    <span>Общо артикули: {storageItems.length}</span>
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
