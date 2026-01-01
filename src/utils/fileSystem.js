export class FileSystem {
    constructor() {
        this.root = {
            type: 'dir',
            name: '/',
            children: {
                home: {
                    type: 'dir',
                    children: {
                        jaimin: {
                            type: 'dir',
                            children: {
                                projects: {
                                    type: 'dir',
                                    children: {
                                        'portfolio-os': { type: 'dir', children: {} },
                                        'mesh-network': { type: 'dir', children: {} },
                                        'ai-chatbot': { type: 'dir', children: {} },
                                    }
                                },
                                skills: {
                                    type: 'dir',
                                    children: {
                                        'frontend.txt': { type: 'file', content: 'React, Vue, Tailwind' },
                                        'backend.txt': { type: 'file', content: 'Node, Python, Go' },
                                    }
                                },
                                'about.txt': { type: 'file', content: 'I am a Full Stack Developer...' },
                                'contact.txt': { type: 'file', content: 'Email: contact@example.com' },
                            }
                        }
                    }
                },
                etc: { type: 'dir', children: {} },
                var: { type: 'dir', children: {} },
                usr: { type: 'dir', children: { bin: { type: 'dir', children: {} } } },
                tmp: { type: 'dir', children: {} },
            }
        }
    }

    // Helper to traverse path
    resolve(path, cwd = '/') {
        // Normalize path
        if (path.startsWith('~')) {
            path = path.replace('~', '/home/jaimin')
        }
        if (!path.startsWith('/')) {
            path = `${cwd === '/' ? '' : cwd}/${path}`
        }

        const parts = path.split('/').filter(p => p && p !== '.')
        let node = this.root
        const traversal = []

        for (const part of parts) {
            if (part === '..') {
                traversal.pop()
                // Re-resolve from root to handle parents
                node = this.root
                for (const p of traversal) {
                    node = node.children[p]
                }
                continue
            }

            if (node.type !== 'dir' || !node.children[part]) {
                return null // Not found
            }
            node = node.children[part]
            traversal.push(part)
        }

        return { node, path: '/' + traversal.join('/') }
    }

    get(path, cwd) {
        const res = this.resolve(path, cwd)
        return res ? res.node : null
    }

    mkdir(path, cwd) {
        const parts = path.split('/')
        const newDirName = parts.pop()
        const parentPath = parts.join('/') || cwd
        const parent = this.get(parentPath, cwd)

        if (parent && parent.type === 'dir') {
            if (parent.children[newDirName]) return false // Exists
            parent.children[newDirName] = { type: 'dir', children: {} }
            return true
        }
        return false
    }

    touch(path, cwd) {
        const parts = path.split('/')
        const fileName = parts.pop()
        const parentPath = parts.join('/') || cwd
        const parent = this.get(parentPath, cwd)

        if (parent && parent.type === 'dir') {
            if (parent.children[fileName]) return true // Updates timestamp in real system
            parent.children[fileName] = { type: 'file', content: '' }
            return true
        }
        return false
    }

    rm(path, cwd, recursive = false) {
        const parts = path.split('/')
        const name = parts.pop()
        const parentPath = parts.join('/') || cwd
        const parent = this.get(parentPath, cwd)

        if (parent && parent.children[name]) {
            if (parent.children[name].type === 'dir' && !recursive) return 'is_dir'
            delete parent.children[name]
            return true
        }
        return false
    }

    ls(path, cwd) {
        const node = this.get(path || '.', cwd)
        if (!node) return null
        if (node.type === 'file') return [path]
        return Object.keys(node.children).map(name => {
            const child = node.children[name]
            return child.type === 'dir' ? `${name}/` : name
        })
    }

    // Add more methods as needed
}

export const initialFileSystem = new FileSystem()
