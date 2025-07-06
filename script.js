
const form = document.getElementById('bookmark-form')
const titleInput = document.getElementById('bookmark-title')
const urlInput = document.getElementById('bookmark-url')
const tagsInput = document.getElementById('bookmark-tags')
const list = document.getElementById('bookmark-list')
const searchInput = document.getElementById('search')
const sortSelect = document.getElementById('sort')
const exportBtn = document.getElementById('export')
const importBtn = document.getElementById('import-btn')
const importInput = document.getElementById('import')
const openAllBtn = document.getElementById('open-all')
const tagsFilter = document.getElementById('tags-filter')

let bookmarksCache = getBookmarks()
let filterTag = ''
let editIndex = null
let searchTerm = ''
let sortBy = 'date'

function getBookmarks() {
    return JSON.parse(localStorage.getItem('bookmarks') || '[]')
}

function saveBookmarks(bookmarks) {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
}


function uniqueTags(bookmarks) {
    const tags = new Set()
    bookmarks.forEach(b => (b.tags||[]).forEach(t => tags.add(t)))
    return Array.from(tags)
}

function renderTags() {
    tagsFilter.innerHTML = ''
    const tags = uniqueTags(bookmarksCache)
    tags.forEach(tag => {
        const btn = document.createElement('button')
        btn.textContent = tag
        btn.className = filterTag === tag ? 'active' : ''
        btn.onclick = () => {
            filterTag = filterTag === tag ? '' : tag
            renderBookmarks()
            renderTags()
        }
        tagsFilter.appendChild(btn)
    })
}

function renderBookmarks() {
    list.innerHTML = ''
    bookmarksCache = getBookmarks()
    let filtered = bookmarksCache
    if (searchTerm) filtered = filtered.filter(b => b.title.toLowerCase().includes(searchTerm) || b.url.toLowerCase().includes(searchTerm) || (b.tags||[]).some(t=>t.toLowerCase().includes(searchTerm)))
    if (filterTag) filtered = filtered.filter(b => (b.tags||[]).includes(filterTag))
    if (sortBy === 'title') filtered = filtered.slice().sort((a,b)=>a.title.localeCompare(b.title))
    filtered.forEach((b, i) => {
        const li = document.createElement('li')
        const link = document.createElement('a')
        link.href = b.url
        link.textContent = b.title
        link.target = '_blank'
        li.appendChild(link)
        if (b.tags && b.tags.length) {
            const tagsSpan = document.createElement('span')
            tagsSpan.textContent = ' [' + b.tags.join(', ') + ']'
            tagsSpan.style.marginLeft = '8px'
            tagsSpan.style.fontSize = '0.9em'
            li.appendChild(tagsSpan)
        }
        const edit = document.createElement('button')
        edit.textContent = 'Edit'
        edit.onclick = () => {
            titleInput.value = b.title
            urlInput.value = b.url
            tagsInput.value = (b.tags||[]).join(', ')
            editIndex = i
        }
        li.appendChild(edit)
        const del = document.createElement('button')
        del.textContent = 'Delete'
        del.onclick = () => {
            if (!confirm('Delete this bookmark?')) return
            const bookmarks = getBookmarks()
            bookmarks.splice(i, 1)
            saveBookmarks(bookmarks)
            renderBookmarks()
            renderTags()
        }
        li.appendChild(del)
        list.appendChild(li)
    })
}


form.onsubmit = e => {
    e.preventDefault()
    const title = titleInput.value.trim()
    const url = urlInput.value.trim()
    const tags = tagsInput.value.split(',').map(t=>t.trim()).filter(Boolean)
    if (!title || !url) return
    const bookmarks = getBookmarks()
    if (editIndex !== null) {
        bookmarks[editIndex] = { title, url, tags }
        editIndex = null
    } else {
        bookmarks.push({ title, url, tags })
    }
    saveBookmarks(bookmarks)
    renderBookmarks()
    renderTags()
    form.reset()
}

searchInput.oninput = e => {
    searchTerm = e.target.value.toLowerCase()
    renderBookmarks()
}

sortSelect.onchange = e => {
    sortBy = e.target.value
    renderBookmarks()
}

exportBtn.onclick = () => {
    const data = JSON.stringify(getBookmarks())
    const blob = new Blob([data], {type:'application/json'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'bookmarks.json'
    a.click()
    URL.revokeObjectURL(url)
}

importBtn.onclick = () => {
    importInput.click()
}

importInput.onchange = e => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = evt => {
        try {
            const imported = JSON.parse(evt.target.result)
            if (Array.isArray(imported)) {
                saveBookmarks(imported)
                renderBookmarks()
                renderTags()
            }
        } catch {}
    }
    reader.readAsText(file)
}

openAllBtn.onclick = () => {
    getBookmarks().forEach(b => window.open(b.url, '_blank'))
}

renderBookmarks()
renderTags()
