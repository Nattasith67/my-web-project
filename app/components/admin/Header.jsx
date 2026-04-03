"use client"
import { useEffect ,useState} from "react"

export default function Header() {
  const [product, setProduct] = useState(null)

  return (
    <header>
      <div>
        <nav>
          <ul>
            <li><a href="admin/dashboard">Dashboard</a></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}