'use client'

import { useEffect, useState } from 'react'
import Head from 'next/head'

export default function KarbitPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      const subHeadline = document.getElementById('sub-headline')
      const mainHeadline = document.getElementById('main-headline')

      if (subHeadline && mainHeadline) {
        mainHeadline.style.opacity = '0.3'
        setTimeout(() => {
          subHeadline.style.opacity = '1'
          subHeadline.style.transform = 'translateY(0)'
        }, 800)
        setTimeout(() => {
          mainHeadline.style.opacity = '1'
          startFlipAnimation()
        }, 1800)
      }
    }, 1000)

    const terminalTimer = setTimeout(() => {
      startTypewriterEffect()
    }, 3000)

    const handleAnchorClick = (e: Event) => {
      const el = e.target as HTMLElement | null
      if (!el) return

      const anchor = el.closest('a') as HTMLAnchorElement | null
      if (!anchor) return

      const href = anchor.getAttribute('href') || ''
      if (href.startsWith('#')) {
        e.preventDefault()
        const targetId = href
        const targetElement = targetId ? document.querySelector(targetId) : null

        if (targetElement) {
          const headerHeight = 64
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          })
        }
      }
    }

    document.addEventListener('click', handleAnchorClick)

    const handleScroll = () => {
      const nav = document.querySelector('nav')
      if (nav) {
        if (window.scrollY > 10) {
          nav.classList.add('shadow-lg')
        } else {
          nav.classList.remove('shadow-lg')
        }
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      clearTimeout(timer)
      clearTimeout(terminalTimer)
      document.removeEventListener('click', handleAnchorClick)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const startFlipAnimation = () => {
    const flipText = document.getElementById('flip-text')
    if (!flipText) return

    const words = ['kisah', 'mine', 'favorit gw']
    const colors = ['text-transparent bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text', 'text-red-400', 'text-purple-400']
    let currentIndex = 0

    const flipWord = () => {
      if (!flipText) return
      
      flipText.style.transform = 'rotateY(90deg)'
      flipText.style.opacity = '0'
      
      setTimeout(() => {
        if (!flipText) return
        flipText.textContent = words[currentIndex]
        flipText.className = `transition-all duration-500 ${colors[currentIndex]}`
        flipText.style.transform = 'rotateY(0deg)'
        flipText.style.opacity = '1'
        
        currentIndex = (currentIndex + 1) % words.length
      }, 300)
    }

    setTimeout(() => {
      flipWord()
      setInterval(flipWord, 3000)
    }, 2000)
  }

  const startTypewriterEffect = () => {
    const terminalContent = document.getElementById('terminal-content')
    const initialCommands = document.getElementById('initial-commands')
    const terminalCursor = document.getElementById('terminal-cursor')
    
    if (!terminalContent || !initialCommands || !terminalCursor) return

    initialCommands.innerHTML = ''
    terminalCursor.style.display = 'inline'

    const commands = [
      { text: '$ chmod +x karbit.sh', color: 'text-white', delay: 50 },
      { text: '$ ./karbit.sh', color: 'text-white', delay: 50 },
      { text: '[+] Initializing karbit environment...', color: 'text-green-500', delay: 30 },
      { text: '[+] Waguri? ', color: 'text-red-500', delay: 40 },
      { text: '[*] ini kan my mine?', color: 'text-yellow-500', delay: 40 }
    ]

    let commandIndex = 0
    let charIndex = 0

    const typeCommand = () => {
      if (commandIndex >= commands.length) {
        terminalCursor.style.display = 'none'
        setTimeout(startAnimeShowcase, 1000)
        return
      }

      const currentCommand = commands[commandIndex]
      const currentChar = currentCommand.text[charIndex]

      if (charIndex === 0) {
        const newLine = document.createElement('span')
        newLine.className = currentCommand.color
        initialCommands.appendChild(newLine)
      }

      const lastLine = initialCommands.lastElementChild
      if (lastLine) {
        lastLine.textContent += currentChar
      }

      charIndex++

      if (charIndex >= currentCommand.text.length) {
        const br = document.createElement('br')
        initialCommands.appendChild(br)
        commandIndex++
        charIndex = 0
        setTimeout(typeCommand, 500) 
      } else {
        setTimeout(typeCommand, currentCommand.delay)
      }
    }

    typeCommand()
  }

  const animeImages = [
    {
      src: "https://i.pinimg.com/736x/56/1e/de/561ede2cbf5b6706108f445b9be55bd8.jpg",
      text: "ini my kisah"
    },
    {
      src: "https://i.pinimg.com/564x/30/be/62/30be62f40bf402f9a7010c814f50aac9.jpg",
      text: "ini juga my kisah"
    },
    {
      src: "https://i.pinimg.com/736x/14/09/ba/1409ba27c9c887391c7a772852b1e934.jpg",
      text: "semua ini my kisah"
    },
    {
      src: "https://i.pinimg.com/736x/d9/50/34/d950345e6bf28f73a162d6ac697d998c.jpg",
      text: "kalau ini admin"
    },
    {
      src: "https://i.pinimg.com/736x/b4/8d/33/b48d334b30324d3e67c1ab587687e53f.jpg",
      text: "bukankah ini mine?"
    }
  ]

  let currentImageIndex = 0
  let showingAnime = false

  const startAnimeShowcase = () => {
    const initialCommands = document.getElementById('initial-commands')
    const animeShowcase = document.getElementById('anime-showcase')

    if (initialCommands && animeShowcase) {
      initialCommands.style.opacity = '0'

      setTimeout(() => {
        initialCommands.style.display = 'none'
        animeShowcase.classList.remove('hidden')
        showingAnime = true
        showNextAnime()
      }, 500)
    }
  }

  const showNextAnime = () => {
    if (!showingAnime) return

    const animeImage = document.getElementById('anime-image') as HTMLImageElement
    const mineText = document.getElementById('mine-text')
    const currentAnime = animeImages[currentImageIndex]

    if (animeImage && mineText) {
      animeImage.classList.remove('opacity-0')
      mineText.classList.remove('scale-100')
      mineText.classList.add('animate-pulse')

      animeImage.src = currentAnime.src
      mineText.textContent = currentAnime.text

      setTimeout(() => {
        animeImage.classList.add('opacity-100')
      }, 100)

      setTimeout(() => {
        mineText.classList.add('scale-100')
      }, 800)

      currentImageIndex = (currentImageIndex + 1) % animeImages.length

      setTimeout(() => {
        if (showingAnime) {
          showNextAnime()
        }
      }, 3000)
    }
  }

  return (
    <>
      <Head>
        <title>Karbit - Bukankah ini my... kisah?</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      <div className="min-h-screen bg-black text-gray-100 font-['Space_Grotesk']">
        {/* Navigation */}
        <nav className="bg-gray-900 border-b border-gray-800 fixed w-full z-50 transition-shadow duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent">Karbit</span>
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    <a href="#home" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300">Home</a>
                    <a href="#about" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300">About</a>
                    <a href="#projects" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300">Projects</a>
                    <a href="#team" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300">Team</a>
                    <a href="#contact" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300">Contact</a>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="ml-4 flex items-center md:ml-6">
                  <a href="/login" className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition duration-300">
                    Login Dashboard
                  </a>
                </div>
              </div>
              <div className="-mr-2 flex md:hidden">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
                >
                  <span className="sr-only">Open main menu</span>
                  <i className="fas fa-bars"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-gray-900 border-t border-gray-800`}>
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#home" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Home</a>
              <a href="#about" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">About</a>
              <a href="#projects" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Projects</a>
              <a href="#team" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Team</a>
              <a href="#contact" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Contact</a>
              <a href="/login" className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white block px-3 py-2 rounded-md text-base font-medium text-center mt-2">
                Login to Dashboard
              </a>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section id="home" className="bg-gradient-to-br from-slate-800 to-slate-900 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <div className="min-h-[120px] flex items-center">
                  <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                    <span id="main-headline" className="bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent transition-opacity duration-800">
                      Bukankah ini...
                    </span>
                    <br />
                    <span
                      id="sub-headline"
                      className="opacity-0 transform translate-y-5 transition-all duration-1000"
                    >
                      my <span 
                        id="flip-text" 
                        className="bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent transition-all duration-500"
                        style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
                      >
                        kisah
                      </span>?
                    </span>
                  </h1>
                </div>
                <p className="text-gray-300 text-lg mb-8 max-w-lg">
                  Kami adalah komunitas karbit - tempat berkumpulnya para hacker dan security enthusiast yang
                  menjalani kisah mereka masing-masing dalam dunia cybersecurity.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <a href="/login" className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition duration-300 text-center">
                    Login to Karbit Dashboard
                  </a>
                  <a href="#about" className="bg-gray-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition duration-300 text-center border border-gray-700">
                    Learn More
                  </a>
                </div>
                <div className="mt-4 text-sm text-gray-400">
                  <p><i className="fas fa-info-circle mr-2"></i>Register hanya bisa dilakukan dengan menghubungi AdminKarbit di LAB SAW04.01</p>
                </div>
              </div>

              <div className="md:w-1/2 hidden md:flex justify-center">
                <div className="relative w-full max-w-md">
                  <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-emerald-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
                  <div className="relative bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700 shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-bounce" style={{ animationDuration: '6s' }}>
                    <div className="flex items-center mb-4">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>

                    {/* Terminal Content Container */}
                    <div id="terminal-content" className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-hidden h-64 relative">
                      {/* Initial Terminal Commands */}
                      <div id="initial-commands" className="transition-opacity duration-500">
                        {/* Commands will be typed here */}
                      </div>

                      {/* Anime Image Container*/}
                      <div id="anime-showcase" className="hidden absolute inset-0 flex flex-col items-center justify-center bg-gray-900 rounded-lg">
                        <div className="relative w-full h-full overflow-hidden rounded-lg">
                          <img
                            id="anime-image"
                            src=""
                            alt="Anime Character"
                            className="w-full h-full object-cover transition-all duration-1000"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div
                              id="mine-text"
                              className="text-2xl font-bold text-white text-center px-4 py-2 bg-black bg-opacity-60 rounded-lg transform scale-0 transition-transform duration-500"
                            >
                              ini mine
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Cursor */}
                      <span id="terminal-cursor" className="text-white animate-pulse">_</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-gray-900 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-emerald-500 transition duration-300">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent mb-2">10+</div>
                <div className="text-gray-300">Karbit Projects</div>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition duration-300">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent mb-2">1.2K</div>
                <div className="text-gray-300">Karbit Members</div>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition duration-300">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent mb-2">5+</div>
                <div className="text-gray-300">Karbit Hackers</div>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-yellow-500 transition duration-300">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent mb-2">2+</div>
                <div className="text-gray-300">CVEs Discovered</div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">About <span className="bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent">Karbit</span></h2>
              <p className="text-gray-400 max-w-3xl mx-auto">
                Kami adalah komunitas karbit - sekelompok hacker dan security researcher yang mempunyai motto "Bukankah ini my kisah?".
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-4">
                      <i className="fas fa-lock text-white"></i>
                    </div>
                    <h3 className="text-xl font-bold">Security First Approach</h3>
                  </div>
                  <p className="text-gray-400">
                    Semua project karbit dibuat dengan prinsip keamanan sebagai fondasi utama. Kami mempraktikkan apa yang kami ajarkan dengan mengimplementasikan langkah-langkah keamanan yang kuat.
                  </p>
                </div>

                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center mr-4">
                      <i className="fas fa-users text-white"></i>
                    </div>
                    <h3 className="text-xl font-bold">Community Driven</h3>
                  </div>
                  <p className="text-gray-400">
                    Kekuatan kami datang dari komunitas kontributor yang beragam. Setiap orang dipersilakan untuk berpartisipasi, terlepas dari tingkat kekarbitan mereka.
                  </p>
                </div>

                <div>
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center mr-4">
                      <i className="fas fa-code-branch text-white"></i>
                    </div>
                    <h3 className="text-xl font-bold">Karbit Style</h3>
                  </div>
                  <p className="text-gray-400">
                    Dengan gaya khas karbit, kami menggabungkan menggunakan konsep "siapa cepat dia dapat" dalam setiap project yang kami kerjakan. Ini kan my mine!
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 overflow-hidden">
                  <div className="flex mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm h-64 overflow-y-auto">
                    <span className="text-blue-400">// Karbit Community Framework v3.1.4</span><br />
                    <span className="text-blue-400">// "Bukankah ini my kisah?"</span><br /><br />

                    <span className="text-purple-400">class</span> <span className="text-yellow-300">KarbitHacker</span> {`{`}<br />
                    &nbsp;&nbsp;<span className="text-purple-400">constructor</span>(name, specialty) {`{`}<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-400">this.name</span> = name;<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-400">this.specialty</span> = specialty;<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-400">this.motto</span> = <span className="text-green-400">"ini kan my mine?"</span>;<br />
                    &nbsp;&nbsp;{`}`}<br /><br />

                    &nbsp;&nbsp;<span className="text-purple-400">hack</span>(target) {`{`}<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">console.log</span>(<span className="text-green-400">{"`Claiming ${target}...`"}</span>);<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">return</span> <span className="text-green-400">"success"</span>;<br />
                    &nbsp;&nbsp;{`}`}<br /><br />

                    &nbsp;&nbsp;<span className="text-purple-400">mulai</span>() {`{`}<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">return</span> <span className="text-green-400">"Lah bukankah ini my?"</span>;<br />
                    &nbsp;&nbsp;{`}`}<br />
                    {`}`}<br /><br />

                    <span className="text-gray-500">// Join komunitas karbit!</span><br />
                    <span className="text-gray-500">// Hubungi AdminKarbit di LAB SAW04.01</span>
                  </div>
                </div>
                <div className="absolute -bottom-5 -right-5 w-32 h-32 bg-blue-500 rounded-full filter blur-3xl opacity-10"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900 border-t border-gray-800">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our <span className="bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent">Mines</span></h2>
              <p className="text-gray-400 max-w-3xl mx-auto">
                Semua ini adalah "my kisah" dari admin!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Project 1 */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 transition duration-300 hover:border-blue-500 hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(16,185,129,0.3)]">
                <div className="w-full h-48 mb-4 rounded-lg overflow-hidden">
                  <img src="https://i.pinimg.com/736x/4f/6a/fe/4f6afedf71cbcf39fa3176b8bf363f18.jpg" alt="Chitanda Eru" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-bold mb-3">Chitanda Eru</h3>
                <p className="text-gray-400 mb-4">
                  "Watashi, kininarimasu!"<br />
                  Ini mine.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-gray-700 text-blue-400 text-xs px-2 py-1 rounded">Curious</span>
                  <span className="bg-gray-700 text-emerald-400 text-xs px-2 py-1 rounded">Energetic</span>
                  <span className="bg-gray-700 text-purple-400 text-xs px-2 py-1 rounded">Cute</span>
                </div>
                <div className="flex items-center justify-between">
                  <a href="#" className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center">
                    View Mine <i className="fas fa-arrow-right ml-1 text-xs"></i>
                  </a>
                  <div className="flex items-center">
                    <i className="fas fa-star text-yellow-400 mr-1"></i>
                    <span className="text-gray-300 text-sm">100%</span>
                  </div>
                </div>
              </div>

              {/* Project 2 */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 transition duration-300 hover:border-emerald-500 hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(16,185,129,0.3)]">
                <div className="w-full h-48 mb-4 rounded-lg overflow-hidden">
                  <img src="https://i.pinimg.com/736x/b4/8d/33/b48d334b30324d3e67c1ab587687e53f.jpg" alt="Zero Two" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-bold mb-3">Kaoruko Waguri</h3>
                <p className="text-gray-400 mb-4">
                  Ini juga my kisah.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-gray-700 text-blue-400 text-xs px-2 py-1 rounded">Playful</span>
                  <span className="bg-gray-700 text-emerald-400 text-xs px-2 py-1 rounded">Strong</span>
                  <span className="bg-gray-700 text-purple-400 text-xs px-2 py-1 rounded">Darling</span>
                </div>
                <div className="flex items-center justify-between">
                  <a href="#" className="text-emerald-400 hover:text-emerald-300 text-sm font-medium flex items-center">
                    View Mine <i className="fas fa-arrow-right ml-1 text-xs"></i>
                  </a>
                  <div className="flex items-center">
                    <i className="fas fa-star text-yellow-400 mr-1"></i>
                    <span className="text-gray-300 text-sm">100%</span>
                  </div>
                </div>
              </div>

              {/* Project 3 */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 transition duration-300 hover:border-purple-500 hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(16,185,129,0.3)]">
                <div className="w-full h-48 mb-4 rounded-lg overflow-hidden">
                  <img src="images/member3.jpg" alt="Miku Nakano" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-bold mb-3">Miku Nakano</h3>
                <p className="text-gray-400 mb-4">
                  Ini mungkin your kisah?
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-gray-700 text-blue-400 text-xs px-2 py-1 rounded">Shy</span>
                  <span className="bg-gray-700 text-emerald-400 text-xs px-2 py-1 rounded">Caring</span>
                  <span className="bg-gray-700 text-purple-400 text-xs px-2 py-1 rounded">History Lover</span>
                </div>
                <div className="flex items-center justify-between">
                  <a href="#" className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center">
                    View Mine <i className="fas fa-arrow-right ml-1 text-xs"></i>
                  </a>
                  <div className="flex items-center">
                    <i className="fas fa-star text-yellow-400 mr-1"></i>
                    <span className="text-gray-300 text-sm">100%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <a href="#" className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium">
                View all our mines <i className="fas fa-arrow-right ml-2"></i>
              </a>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section id="team" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900 border-t border-gray-800">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Karbit <span className="bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent">Core Team</span></h2>
              <p className="text-gray-400 max-w-3xl mx-auto">
                Meet the karbit hackers dan security experts yang menggerakkan komunitas karbit dengan semangat "ini kan my mine?"
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-8">
              {/* Team Member 1 */}
              <div className="w-full sm:w-1/2 lg:w-1/4 bg-gray-800 rounded-xl p-6 text-center border border-gray-700 hover:border-blue-500 transition duration-300">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 p-1">
                  <div className="bg-gray-900 w-full h-full rounded-full flex items-center justify-center overflow-hidden">
                    <img src="/images/member1.jpg" alt="Team member" className="w-full h-full object-cover" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-1">Chitanda</h3>
                <p className="text-blue-400 mb-4">Karbit Security Researcher</p>
                <p className="text-gray-400 text-sm mb-4">
                  Passion dalam Cybersecurity dengan 30+ tahun pengalaman dalam vulnerability research dan exploit development. <br />"Bukankah ini my kisah? emang bukan"
                </p>
                <div className="flex justify-center space-x-4">
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition duration-300 relative group">
                    <i className="fab fa-github"></i>
                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      GitHub Profile
                    </span>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-blue-500 transition duration-300 relative group">
                    <i className="fab fa-facebook"></i>
                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      Facebook Profile
                    </span>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-red-500 transition duration-300 relative group">
                    <i className="fab fa-youtube"></i>
                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      Karbit Security Talks
                    </span>
                  </a>
                </div>
              </div>

              {/* Team Member 2 */}
              <div className="w-full sm:w-1/2 lg:w-1/4 bg-gray-800 rounded-xl p-6 text-center border border-gray-700 hover:border-emerald-500 transition duration-300">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 p-1">
                  <div className="bg-gray-900 w-full h-full rounded-full flex items-center justify-center overflow-hidden">
                    <img src="/images/member2.jpg" alt="Team member" className="w-full h-full object-cover" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-1">Coslow</h3>
                <p className="text-emerald-400 mb-4">Karbit Lead Developer</p>
                <p className="text-gray-400 text-sm mb-4">
                  Seorang karbiters sejati dengan lebih dari 1000+ CKE (Common Karbiter and Exposures), awas kalau tiba-tiba nanti waifumu diclaim.
                </p>
                <div className="flex justify-center space-x-4">
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition duration-300">
                    <i className="fab fa-github"></i>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-blue-500 transition duration-300">
                    <i className="fab fa-facebook"></i>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-purple-500 transition duration-300">
                    <i className="fab fa-dev"></i>
                  </a>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <p className="text-gray-400 mb-6">Kami selalu mencari karbit hackers dan developers berbakat untuk bergabung dengan tim kami di LAB SAW04.01</p>
              <a href="#" className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition duration-300 inline-flex items-center">
                Join Karbit Team <i className="fas fa-arrow-right ml-2"></i>
              </a>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900 border-t border-gray-800">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Karbit Community <span className="bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent">Feedback</span></h2>
              <p className="text-gray-400 max-w-3xl mx-auto">
                Apa yang dikatakan para karbit professionals dan organisasi karbit tentang komunitas karbit kami.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-4">
                    CT
                  </div>
                  <div>
                    <h4 className="font-bold">Chris Taylor</h4>
                    <p className="text-gray-400 text-sm">Security Engineer @TechCorp</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-6">
                  "KarbitScan has become an essential part of our security toolkit. Tool-tool karbit telah membantu kami mengidentifikasi calon-calon mine sebelum di-claim orang lain. Tools ini benar benar my mine!"
                </p>
                <div className="flex">
                  <i className="fas fa-star text-yellow-400"></i>
                  <i className="fas fa-star text-yellow-400"></i>
                  <i className="fas fa-star text-yellow-400"></i>
                  <i className="fas fa-star text-yellow-400"></i>
                  <i className="fas fa-star text-yellow-400"></i>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold mr-4">
                    AM
                  </div>
                  <div>
                    <h4 className="font-bold">Aisha Mohammed</h4>
                    <p className="text-gray-400 text-sm">CISO @SecureBank</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-6">
                  "Transparansi project-project karbit memberikan kami confidence dalam security mereka. KarbitGuard implementation telah significantly meningkatkan authentication security kami."
                </p>
                <div className="flex">
                  <i className="fas fa-star text-yellow-400"></i>
                  <i className="fas fa-star text-yellow-400"></i>
                  <i className="fas fa-star text-yellow-400"></i>
                  <i className="fas fa-star text-yellow-400"></i>
                  <i className="fas fa-star-half-alt text-yellow-400"></i>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold mr-4">
                    DL
                  </div>
                  <div>
                    <h4 className="font-bold">David Lin</h4>
                    <p className="text-gray-400 text-sm">Karbit Open Source Contributor</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-6">
                  "Sebagai contributor, saya menemukan komunitas karbit sangat welcoming dan knowledgeable. Code review process mereka thorough dan educational. Bukankah ini my kisah juga?"
                </p>
                <div className="flex">
                  <i className="fas fa-star text-yellow-400"></i>
                  <i className="fas fa-star text-yellow-400"></i>
                  <i className="fas fa-star text-yellow-400"></i>
                  <i className="fas fa-star text-yellow-400"></i>
                  <i className="fas fa-star text-yellow-400"></i>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-900 to-gray-900">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to <span className="bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent">Join Karbit</span>?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Bergabunglah dengan ribuan hackers karbit dan security professionals yang menggunakan solusi open source security kami dengan gaya yang cocok untuk karbiters.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <a href="#" className="bg-white text-gray-900 px-8 py-3 rounded-lg font-bold hover:bg-gray-200 transition duration-300">
                Login to Karbit Dashboard
              </a>
              <a href="#" className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-gray-900 transition duration-300">
                Contact AdminKarbit
              </a>
            </div>
            <div className="mt-4 text-sm text-gray-400">
              <p>Ingin register? Hubungi AdminKarbit di LAB SAW04.01</p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Get in <span className="bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent">Touch</span></h2>
                <p className="text-gray-400 mb-8">
                  Ada pertanyaan tentang karbit projects atau ingin kolaborasi? Reach out kita melalui channel-channel berikut.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-opacity-20 rounded-lg flex items-center justify-center mr-4 mt-1">
                      <i className="fas fa-envelope text-blue-500"></i>
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Email Karbit</h4>
                      <a href="mailto:contact@karbit.org" className="text-blue-400 hover:text-blue-300">contact@karbit.org</a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-opacity-20 rounded-lg flex items-center justify-center mr-4 mt-1">
                      <i className="fab fa-github text-purple-500"></i>
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">GitHub Karbit</h4>
                      <a href="https://github.com/karbitcommunity" className="text-purple-400 hover:text-purple-300">github.com/karbitcommunity</a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-opacity-20 rounded-lg flex items-center justify-center mr-4 mt-1">
                      <i className="fab fa-discord text-emerald-500"></i>
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Karbit Discord</h4>
                      <a href="#" className="text-emerald-400 hover:text-emerald-300">Join karbit community</a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-opacity-20 rounded-lg flex items-center justify-center mr-4 mt-1">
                      <i className="fas fa-map-marker-alt text-red-500"></i>
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Karbit Headquarter</h4>
                      <a href="#" className="text-red-400 hover:text-red-300">LAB SAW04.01 - AdminKarbit</a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
                <h3 className="text-xl font-bold mb-6">Send Karbit Message</h3>
                <form>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-400 mb-2">Name</label>
                    <input
                      type="text"
                      id="name"
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-400 mb-2">Email</label>
                    <input
                      type="email"
                      id="email"
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="subject" className="block text-gray-400 mb-2">Subject</label>
                    <select
                      id="subject"
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option>General Karbit Inquiry</option>
                      <option>Karbit Project Contribution</option>
                      <option>Karbit Security Report</option>
                      <option>Karbit Partnership</option>
                    </select>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="message" className="block text-gray-400 mb-2">Message</label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Tulis pesan karbit anda disini..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition duration-300"
                  >
                    Send Karbit Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 border-t border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent mb-4">Karbit</h3>
                <p className="text-gray-400">
                  Karbit Community - Building secure karbit environment through community collaboration. "Bukankah ini my kisah?"
                </p>
                <div className="flex space-x-4 mt-6">
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition duration-300">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-purple-400 transition duration-300">
                    <i className="fab fa-github"></i>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-red-400 transition duration-300">
                    <i className="fab fa-youtube"></i>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-blue-500 transition duration-300">
                    <i className="fab fa-linkedin"></i>
                  </a>
                </div>
              </div>

              <div>
                <h4 className="text-gray-300 font-bold mb-4">Karbit Projects</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">KarbitScan</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">KarbitGuard</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">KarbitSentinel</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">KarbitLib</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">View All</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-gray-300 font-bold mb-4">Karbit Resources</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Documentation</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Karbit Blog</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Tutorials</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Research Papers</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">API Reference</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-gray-300 font-bold mb-4">Karbit Legal</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Privacy Policy</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Terms of Service</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Security Policy</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Code of Conduct</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">License</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-500 text-sm mb-4 md:mb-0">
                &copy; 2024 Karbit Community. All rights reserved. "ini kan my mine?"
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-500 hover:text-gray-400 text-sm transition duration-300">LAB SAW04.01</a>
                <a href="#" className="text-gray-500 hover:text-gray-400 text-sm transition duration-300">AdminKarbit</a>
                <a href="#" className="text-gray-500 hover:text-gray-400 text-sm transition duration-300">Status</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}