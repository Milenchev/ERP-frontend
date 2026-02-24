import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Plus, Search } from 'lucide-react'

interface Employee {
  uid: string
  name: string
  salary: number
  insurance: number
  tax: number
  additionalPay: number
}

interface ApiResponse {
  employees: Employee[]
}

export function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5001/employees')
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data: ApiResponse = await response.json()
        setEmployees(data.employees)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getTotal = (emp: Employee) => {
    return emp.salary + emp.insurance - emp.tax + emp.additionalPay
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
    <div className="documents">
      <div className="documents__container">
        <div className="documents__main documents__main--full">
          {/* Header */}
          <div className="documents__header">
            <div className="documents__header-left">
              <span className="documents__title">Служители</span>
              <span className="documents__count">({employees.length})</span>
            </div>

            <div className="documents__header-right">
              <Link to="/add-employee">
                <Button className="documents__btn-add">
                  <Plus />
                  Добавяне на служител
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
                  <th>Име</th>
                  <th>Заплата</th>
                  <th>Осигуровки</th>
                  <th>Данък</th>
                  <th>Допълнение</th>
                  <th>Общо</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee, index) => (
                  <tr key={employee.uid}>
                    <td>{index + 1}</td>
                    <td>{employee.name}</td>
                    <td>{employee.salary.toFixed(2)} лв.</td>
                    <td>{employee.insurance.toFixed(2)} лв.</td>
                    <td>{employee.tax.toFixed(2)} лв.</td>
                    <td>{employee.additionalPay.toFixed(2)} лв.</td>
                    <td>{getTotal(employee).toFixed(2)} лв.</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={5} style={{ textAlign: 'left' }}>
                    <span>Общо служители: {employees.length}</span>
                  </td>
                  <td colSpan={2}>
                    <span>Тотал: {employees.reduce((sum, e) => sum + getTotal(e), 0).toFixed(2)} лв.</span>
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
