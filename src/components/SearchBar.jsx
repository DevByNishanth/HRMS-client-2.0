import { useEffect, useState } from 'react'
import { Search, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'

// Base URL for the backend API
const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 'https://sece_hrms_server.onrender.com'

const SearchBar = () => {
    // What the user typed in the search box
    const [query, setQuery] = useState('')

    // The list of faculty returned by the API
    const [results, setResults] = useState([])

    // True while we are waiting for the API to respond
    const [loading, setLoading] = useState(false)

    // True when the dropdown list should be visible
    const [isOpen, setIsOpen] = useState(false)

    // Full name like "Mr ANAND P S"
    const getFullName = (faculty) =>
        [faculty.salutation, faculty.firstName, faculty.lastName]
            .filter(Boolean)
            .join(' ')

    // The API returns an array like: [{ data: [ {faculty...} ], success: true }]
    // This function pulls the faculty list out from inside that wrapper
    const getFacultyList = (data) => {
        if (Array.isArray(data)) {
            // Take the "data" array from each item and join them all together
            return data.flatMap((item) =>
                Array.isArray(item?.data) ? item.data : [],
            )
        }
        // Fallback: maybe the API returns { data: [...] } directly
        if (Array.isArray(data?.data)) return data.data
        return []
    }

    // Initials like "AP" — used when there is no profile image
    const getInitials = (faculty) => {
        const first = faculty.firstName?.charAt(0) || ''
        const last = faculty.lastName?.charAt(0) || ''
        return (first + last).toUpperCase() || '?'
    }

    // Runs whenever the user types in the search box
    const handleChange = (e) => {
        const value = e.target.value
        setQuery(value)

        // If the box is emptied, clear the list right away
        if (value.trim() === '') {
            setResults([])
            setLoading(false)
        } else {
            setLoading(true)
        }
    }

    // Search whenever the user types, but only after they stop typing (debounce)
    useEffect(() => {
        // If the search box is empty, there is nothing to fetch
        const keyword = query.trim()
        if (keyword === '') return

        // This flag makes sure we ignore old API responses if the user typed again
        let isCurrent = true

        // Wait 400ms after the last keystroke, then call the API
        const timer = setTimeout(async () => {
            try {
                // Send the login token so the backend knows who we are
                const token = localStorage.getItem('hrms_token')

                const response = await fetch(
                    `${API_BASE_URL.replace(/\/$/, '')}/api/faculties/search-available?q=${encodeURIComponent(keyword)}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                )

                const data = await response.json()

                // Only update the list if this is still the latest search
                if (isCurrent) {
                    setResults(getFacultyList(data))
                }
            } catch (error) {
                console.error('Search failed:', error)
                if (isCurrent) setResults([])
            } finally {
                if (isCurrent) setLoading(false)
            }
        }, 400)

        // Cleanup: cancel the timer if the user types again before 400ms
        return () => {
            isCurrent = false
            clearTimeout(timer)
        }
    }, [query])

    return (
        <div className="relative">
            <div className="search-container border w-[340px] border-white/20 px-4 py-1.5 rounded-full flex items-center gap-2">
                <Search size={18} className="text-gray-300" />
                <input
                    type="text"
                    placeholder="Search"
                    value={query}
                    onFocus={() => setIsOpen(true)}
                    onBlur={() => setTimeout(() => setIsOpen(false), 150)}
                    onChange={handleChange}
                    className="bg-transparent outline-none text-sm text-gray-300 w-full"
                />
                {loading && <Loader2 size={14} className="animate-spin text-gray-300" />}
            </div>

            {/* Dropdown with the search results */}
            {isOpen && query.trim() !== '' && (
                <div className="absolute left-0 right-0 top-full mt-2 z-50 max-h-80 overflow-y-auto table-custom-scrollbar rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg-card)] shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
                    {loading ? (
                        <p className="px-4 py-3 text-sm text-[var(--theme-text-muted)]">Searching...</p>
                    ) : results.length > 0 ? (
                        <div className="p-2 space-y-1">
                            {results.map((faculty) => (
                                <div
                                    key={faculty.facultyId}
                                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-[var(--theme-bg-hover)]"
                                >
                                    {/* Profile image, or initials if there is no image */}
                                    <div className="profile-container relative">
                                        {faculty.profileImage ? (
                                            <img
                                                src={faculty.profileImage}
                                                alt={getFullName(faculty)}
                                                className="h-10 w-10 shrink-0 rounded-full object-cover"
                                            />
                                        ) : (
                                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-[14px] font-semibold text-white">
                                                {getInitials(faculty)}
                                            </span>
                                        )}

                                        {faculty.hasPunchedToday ? <div className="active-container w-3 h-3 bg-teal-400 rounded-full absolute bottom-0 right-0">

                                        </div> :
                                            <div className="active-container w-3 h-3 bg-red-400 rounded-full absolute bottom-0 right-0">

                                            </div>}
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate text-[14px] font-semibold text-[var(--theme-text-main)]">
                                            {getFullName(faculty)}
                                        </p>
                                        <p className="truncate text-[12px] text-[var(--theme-text-muted)]">
                                            {faculty.department} · {faculty.phone}
                                        </p>
                                        <p className="truncate text-[12px] text-[var(--theme-text-muted)]">
                                            {faculty.email}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="px-4 py-3 text-sm text-[var(--theme-text-muted)]">
                            No faculty found for &quot;{query}&quot;
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}

export default SearchBar

