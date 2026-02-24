import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowUpRight, FileText, TrendingUp, TrendingDown } from 'lucide-react'
import { getBadgeClass, getBadgeText } from '@/lib/badge-utils'

interface Invoice {
  date: string
  supplier?: string
  client?: string
  invoiceValue: number
  invoiceState: number
  State?: number
}

interface DashboardData {
  incoming: Invoice[]
  outgoing: Invoice[]
}

export function Dashboard() {
  const [incomingInvoices, setIncomingInvoices] = useState<Invoice[]>([])
  const [outgoingInvoices, setOutgoingInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5001/getDashboardInvoices')
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data: DashboardData = await response.json()
        setIncomingInvoices(data.incoming)
        setOutgoingInvoices(data.outgoing)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const totalIncomingValue = incomingInvoices.reduce((sum, invoice) => sum + invoice.invoiceValue, 0)
  const totalOutgoingValue = outgoingInvoices.reduce((sum, invoice) => sum + invoice.invoiceValue, 0)
  const totalDebtToUs = outgoingInvoices
    .filter((inv) => inv.invoiceState !== 1)
    .reduce((sum, inv) => sum + inv.invoiceValue, 0)
  const totalDebtToSuppliers = incomingInvoices
    .filter((inv) => inv.invoiceState !== 1)
    .reduce((sum, inv) => sum + inv.invoiceValue, 0)

  const getStatusBadge = (state: number) => {
    return <span className={getBadgeClass(state)}>{getBadgeText(state)}</span>
  }

  if (loading) {
    return (
      <div className="dashboard__loading">
        <p>Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard__error">
        <p>Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div className="dashboard__header-content">
          <h1>Табло</h1>
          <p>Преглед на вашия бизнес</p>
        </div>
      </div>

      <div className="dashboard__metrics">
        <div className="dashboard__metric-card dashboard__metric-card--primary">
          <div className="dashboard__metric-icon">
            <ArrowUpRight />
          </div>
          <div className="dashboard__metric-content">
            <span className="dashboard__metric-label">Входни фактури</span>
            <span className="dashboard__metric-value">{totalIncomingValue.toFixed(2)} лв</span>
          </div>
        </div>

        <div className="dashboard__metric-card dashboard__metric-card--success">
          <div className="dashboard__metric-icon">
            <TrendingUp />
          </div>
          <div className="dashboard__metric-content">
            <span className="dashboard__metric-label">Изходни фактури</span>
            <span className="dashboard__metric-value">{totalOutgoingValue.toFixed(2)} лв</span>
          </div>
        </div>

        <div className="dashboard__metric-card dashboard__metric-card--warning">
          <div className="dashboard__metric-icon">
            <FileText />
          </div>
          <div className="dashboard__metric-content">
            <span className="dashboard__metric-label">Задължения към нас</span>
            <span className="dashboard__metric-value">{totalDebtToUs.toFixed(2)} лв</span>
          </div>
        </div>

        <div className="dashboard__metric-card dashboard__metric-card--danger">
          <div className="dashboard__metric-icon">
            <TrendingDown />
          </div>
          <div className="dashboard__metric-content">
            <span className="dashboard__metric-label">Задължения към доставчици</span>
            <span className="dashboard__metric-value">{totalDebtToSuppliers.toFixed(2)} лв</span>
          </div>
        </div>
      </div>

      <div className="dashboard__tables">
        <Card className="dashboard__table-card">
          <CardHeader>
            <CardTitle>Последните 5 входящи фактури</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="dashboard__table-wrapper">
              <table className="dashboard__table">
                <thead>
                  <tr>
                    <th>Дата на фактурата</th>
                    <th>Доставчик</th>
                    <th>Стойност</th>
                    <th>Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {incomingInvoices.slice(0, 5).map((invoice, index) => (
                    <tr key={index}>
                      <td>{invoice.date}</td>
                      <td>{invoice.supplier}</td>
                      <td>{invoice.invoiceValue.toFixed(2)} лв</td>
                      <td>{getStatusBadge(invoice.State ?? invoice.invoiceState)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard__table-card">
          <CardHeader>
            <CardTitle>Последните 5 изходящи фактури</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="dashboard__table-wrapper">
              <table className="dashboard__table">
                <thead>
                  <tr>
                    <th>Дата на фактурата</th>
                    <th>Клиент</th>
                    <th>Стойност</th>
                    <th>Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {outgoingInvoices.slice(0, 5).map((invoice, index) => (
                    <tr key={index}>
                      <td>{invoice.date}</td>
                      <td>{invoice.client}</td>
                      <td>{invoice.invoiceValue.toFixed(2)} лв</td>
                      <td>{getStatusBadge(invoice.invoiceState)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
