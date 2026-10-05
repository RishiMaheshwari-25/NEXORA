import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useChat } from '../hooks/useChat.js'
import '../../../styles/dashboard.scss'

const MIN_SIDEBAR_WIDTH = 210
const MAX_SIDEBAR_WIDTH = 380
const AssistantMessage = lazy(() => import('../components/AssistantMessage.jsx'))

function Icon({ name, size = 16 }) {
  const paths = {
    home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9M9 20v-7h6v7" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    note: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h5" /></>,
    sparkle: <><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" /><path d="m19 15 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z" /></>,
    library: <><rect x="4" y="6" width="16" height="14" rx="2" /><path d="M8 6V4h8v2M4 11h16" /></>,
    message: <><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8 8 0 0 1-3.5-.8L4 20l1.3-3.7A7.1 7.1 0 0 1 4 12c0-4.1 3.6-7.5 8-7.5s8 3.1 8 7Z" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></>,
    globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
    code: <><path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14" /></>,
    attach: <><path d="m8 12.5 6.6-6.6a3.5 3.5 0 0 1 5 5L10 20.5a5 5 0 0 1-7-7L13 3.5" /></>,
    mic: <><rect x="9" y="3" width="6" height="12" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6" /></>,
    arrow: <><path d="M12 19V5M6 11l6-6 6 6" /></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 1 4 17.5z" /><path d="M4 16a2 2 0 0 1 2-2h14M8 7h8" /></>,
    brain: <><path d="M12 5a3 3 0 0 0-5.8 1A3.5 3.5 0 0 0 5 12a3.5 3.5 0 0 0 2 6 3 3 0 0 0 5-1zM12 5a3 3 0 0 1 5.8 1A3.5 3.5 0 0 1 19 12a3.5 3.5 0 0 1-2 6 3 3 0 0 1-5-1zM12 5v14M8 9l4 2m4-2-4 2m-4 4 4-2m4 2-4-2" /></>,
    chart: <><path d="M4 19V5M4 19h17" /><path d="m7 15 4-4 3 2 5-6" /><path d="M16 7h3v3" /></>,
    bulb: <><path d="M9 18h6M10 22h4M8.5 14.5A6 6 0 1 1 15.5 14c-.8.7-1.2 1.3-1.3 2h-4.4c-.1-.6-.5-1.1-1.3-1.5Z" /><path d="M12 2v1M4.9 4.9l.8.8m13.4-.8-.8.8" /></>,
    image: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9" r="1.5" /><path d="m21 15-5-5L5 20" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
    crown: <><path d="m3 8 5 4 4-7 4 7 5-4-2 11H5L3 8Z" /></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
  }

  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  )
}

// Layer 4: show the conversation and pass user actions to the chat hook.
const Dashboard = () => {
  const {
    initializeSocketConnection,
    chats,
    currentChatId,
    messages,
    isLoading,
    error,
    isChatsLoading,
    chatsError,
    isMessagesLoading,
    loadChatHistory,
    openChat,
    startNewChat,
    sendChatMessage
  } = useChat()
  const user = useSelector(state => state.auth.user)
  const [sidebarWidth, setSidebarWidth] = useState(270)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const conversationRef = useRef(null)

  useEffect(() => {
    initializeSocketConnection()
  }, [initializeSocketConnection])

  useEffect(() => {
    loadChatHistory()
  }, [loadChatHistory])

  useEffect(() => {
    const conversation = conversationRef.current
    if (conversation) {
      conversation.scrollTo({ top: conversation.scrollHeight, behavior: 'smooth' })
    }
  }, [messages])

  // The screen only validates and clears the input; the hook handles sending.
  const handleSendMessage = () => {
    const content = draft.trim()
    if (!content || isLoading || isMessagesLoading) return

    setDraft('')
    sendChatMessage(content)
  }

  // Open a saved chat and close the mobile sidebar after selection.
  const handleOpenChat = chatId => {
    if (isLoading) return
    openChat(chatId)
    setIsSidebarOpen(false)
  }

  // Keep the existing New Chat button useful on both desktop and mobile.
  const handleNewChat = () => {
    if (isLoading) return
    startNewChat()
    setIsSidebarOpen(false)
  }

  return (
    <main className="dashboard">
      <aside
        className={`dashboard-sidebar${isSidebarOpen ? ' dashboard-sidebar--open' : ''}`}
        style={{ '--sidebar-width': `${sidebarWidth}px` }}
      >
        <div className="dashboard-brand">
          <span className="dashboard-brand__mark">N</span>
          <span>NEXORA</span>
          <button
            className="dashboard-sidebar__toggle"
            type="button"
            aria-label="Close sidebar"
            onClick={() => setIsSidebarOpen(false)}
          >
            ‹
          </button>
        </div>

        <button className="dashboard-new-chat" type="button" disabled={isLoading} onClick={handleNewChat}>
          <Icon name="plus" size={17} />
          <span>New Chat</span>
        </button>

        <nav className="dashboard-nav" aria-label="Main navigation">
          <a className="dashboard-nav__item" href="#home"><Icon name="home" />Home</a>
          <a className="dashboard-nav__item" href="#library"><Icon name="library" />Library</a>
          <a className="dashboard-nav__item" href="#discover"><Icon name="search" />Discover</a>
        </nav>

        <section className="dashboard-recent" aria-label="Recent chats">
          <div className="dashboard-recent__heading">
            <span>CHATS</span>
          </div>
          {isChatsLoading ? (
            <p className="dashboard-recent__state" role="status">Loading your chats...</p>
          ) : chatsError ? (
            <div className="dashboard-recent__state dashboard-recent__state--error" role="alert">
              <p>{chatsError}</p>
              <button type="button" onClick={loadChatHistory}>Try again</button>
            </div>
          ) : chats.length === 0 ? (
            <div className="dashboard-recent__empty">
              <span className="dashboard-recent__empty-icon"><Icon name="message" size={16} /></span>
              <strong>No chats yet</strong>
              <p>Your conversations will appear here when you start chatting.</p>
              <button type="button" onClick={handleNewChat}>Start a conversation</button>
            </div>
          ) : chats.map(chat => (
            <button
              className={`dashboard-recent__item${currentChatId === chat._id ? ' dashboard-recent__item--active' : ''}`}
              type="button"
              key={chat._id}
              title={chat.title || 'Untitled chat'}
              aria-current={currentChatId === chat._id ? 'page' : undefined}
              disabled={isLoading}
              onClick={() => handleOpenChat(chat._id)}
            >
              <span>{chat.title || 'Untitled chat'}</span>
            </button>
          ))}
        </section>

        <div className="dashboard-sidebar__bottom">
          <div className="dashboard-profile">
            <div className="dashboard-profile__avatar">{user?.username?.slice(0, 2)?.toUpperCase() || 'RM'}</div>
            <div className="dashboard-profile__details">
              <strong>{user?.username || 'Nexora Member'}</strong>
              <span>Free Plan</span>
            </div>
            <button type="button" aria-label="Settings">⚙</button>
          </div>
        </div>
      </aside>

      <button
        className={`dashboard-sidebar-backdrop${isSidebarOpen ? ' dashboard-sidebar-backdrop--visible' : ''}`}
        type="button"
        aria-label="Close navigation menu"
        onClick={() => setIsSidebarOpen(false)}
      />
      <div
        className="dashboard-resize-handle"
        role="separator"
        aria-label="Resize sidebar"
        aria-orientation="vertical"
        aria-valuemin={MIN_SIDEBAR_WIDTH}
        aria-valuemax={MAX_SIDEBAR_WIDTH}
        aria-valuenow={sidebarWidth}
        title="Drag to resize sidebar"
        tabIndex={0}
        onPointerDown={event => {
          event.currentTarget.setPointerCapture(event.pointerId)
        }}
        onPointerMove={event => {
          if (event.buttons === 1) {
            setSidebarWidth(Math.max(MIN_SIDEBAR_WIDTH, Math.min(MAX_SIDEBAR_WIDTH, event.clientX)))
          }
        }}
        onKeyDown={event => {
          if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault()
            const direction = event.key === 'ArrowRight' ? 10 : -10
            setSidebarWidth(width => Math.max(MIN_SIDEBAR_WIDTH, Math.min(MAX_SIDEBAR_WIDTH, width + direction)))
          }
        }}
      />

      <section className="dashboard-main" id="home">
        <header className="dashboard-topbar">
          <button
            className="dashboard-mobile-menu dashboard-icon-button"
            type="button"
            aria-label="Open navigation menu"
            aria-expanded={isSidebarOpen}
            onClick={() => setIsSidebarOpen(true)}
          >
            <Icon name="menu" />
          </button>
          <div className="dashboard-topbar__actions">
            <button className="dashboard-pro" type="button"><Icon name="crown" size={14} /> Pro</button>
            <button className="dashboard-icon-button" type="button" aria-label="Search"><Icon name="search" /></button>
            <button className="dashboard-icon-button dashboard-notifications" type="button" aria-label="Notifications"><Icon name="bell" /></button>
            <div className="dashboard-topbar__avatar">{user?.username?.slice(0, 1)?.toUpperCase() || 'R'}</div>
          </div>
        </header>

        <div className={`dashboard-content${messages.length === 0 && !isMessagesLoading && !isLoading && !error ? ' dashboard-content--empty' : ''}`}>
          <section className="dashboard-welcome">
            <span className="dashboard-welcome__mark"><Icon name="sparkle" size={25} /></span>
            <h1>NEXORA</h1>
            <p className="dashboard-welcome__subheading">Knowledge today. Mastery tomorrow.</p>
          </section>

          <section className="dashboard-preview" aria-label="Chat conversation">
            <div className="dashboard-preview__heading">
              <span className="dashboard-preview__status" />
              <span>CHAT</span>
            </div>
            <div className="dashboard-preview__messages" ref={conversationRef} aria-live="polite">
              {messages.map(message => (
                <article
                  className={`dashboard-preview__message dashboard-preview__message--${message.role}`}
                  key={message.id}
                >
                  {message.role === 'user' ? (
                    <>
                      <span className="dashboard-preview__label">YOU</span>
                      <p>{message.content}</p>
                    </>
                  ) : (
                    <>
                      <div className="dashboard-preview__assistant-heading">
                        <span className="dashboard-preview__assistant-icon"><Icon name="sparkle" size={15} /></span>
                        <span>NEXORA AI</span>
                        <span className="dashboard-preview__assistant-tag">PORTFOLIO COACH</span>
                      </div>
                      <Suspense fallback={<p className="dashboard-chat-status" role="status">Preparing your response...</p>}>
                        <AssistantMessage
                          content={message.content}
                          animate={message.animate}
                          scrollContainerRef={conversationRef}
                        />
                      </Suspense>
                    </>
                  )}
                </article>
              ))}
              {isMessagesLoading && <p className="dashboard-chat-status" role="status">Opening your conversation...</p>}
              {isLoading && <p className="dashboard-chat-status" role="status">Nexora is thinking...</p>}
              {error && <p className="dashboard-chat-error" role="alert">{error}</p>}
            </div>
          </section>

          <section className="dashboard-composer" aria-label="Ask Nexora">
            <textarea
              aria-label="Ask anything"
              placeholder="Ask anything..."
              rows="1"
              value={draft}
              onChange={event => setDraft(event.target.value)}
              disabled={isMessagesLoading}
              onKeyDown={event => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  handleSendMessage()
                }
              }}
            />
            <div className="dashboard-composer__controls">
              <div className="dashboard-composer__send">
                <button className="dashboard-send-button" type="button" aria-label="Send" disabled={isLoading || isMessagesLoading || !draft.trim()} onClick={handleSendMessage}><Icon name="arrow" size={18} /></button>
              </div>
            </div>
          </section>

          <div className="dashboard-suggestions" aria-label="Try asking">
            {["Explain like I'm 5", 'Help me debug', 'Create a plan', 'Give me ideas'].map(prompt => (
              <button key={prompt} type="button" onClick={() => setDraft(prompt)}>
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default Dashboard
