import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useChat } from '../hooks/useChat.js'
import '../../../styles/dashboard.scss'

const MIN_SIDEBAR_WIDTH = 210
const MAX_SIDEBAR_WIDTH = 380
const AssistantMessage = lazy(() => import('../components/AssistantMessage.jsx'))

function Icon({ name, size = 16 }) {
  const paths = {
    sparkle: <><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" /><path d="m19 15 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z" /></>,
    message: <><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8 8 0 0 1-3.5-.8L4 20l1.3-3.7A7.1 7.1 0 0 1 4 12c0-4.1 3.6-7.5 8-7.5s8 3.1 8 7Z" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    send: <><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></>,
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
  const [sidebarWidth, setSidebarWidth] = useState(210)
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
  const activeChat = chats.find(chat => chat._id === currentChatId)

  return (
    <main className="dashboard">
      <aside
        className={`dashboard-sidebar${isSidebarOpen ? ' dashboard-sidebar--open' : ''}`}
        style={{ '--sidebar-width': `${sidebarWidth}px` }}
      >
        <div className="dashboard-brand">
          <span className="dashboard-brand__mark"><Icon name="sparkle" size={18} /></span>
          <span className="dashboard-brand__name">NEXORA <small>AI</small></span>
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

        <section className="dashboard-recent" aria-label="Recent chats">
          <div className="dashboard-recent__heading">
            <span>Recent chats</span>
            <span className="dashboard-recent__chevron" aria-hidden="true" />
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
              <span>{user?.email || 'Your account'}</span>
            </div>
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
            <span className="dashboard-topbar__title">
              {activeChat?.title || (currentChatId ? 'Conversation' : 'New conversation')}
            </span>
          </div>
        </header>

        <div className={`dashboard-content${messages.length === 0 && !isMessagesLoading && !isLoading && !error ? ' dashboard-content--empty' : ''}`}>
          <section className="dashboard-welcome">
            <h1>Hey, {user?.username || 'there'}.</h1>
            <p className="dashboard-welcome__subheading">What’s on your mind today?</p>
          </section>

          <section className="dashboard-preview" aria-label="Chat conversation">
            <div className="dashboard-preview__messages" ref={conversationRef} aria-live="polite">
              {messages.map(message => (
                <article
                  className={`dashboard-preview__message dashboard-preview__message--${message.role}`}
                  key={message.id}
                >
                  {message.role === 'user' ? (
                    <p>{message.content}</p>
                  ) : (
                    <Suspense fallback={<p className="dashboard-chat-status" role="status">Preparing your response...</p>}>
                      <AssistantMessage
                        content={message.content}
                        animate={message.animate}
                        scrollContainerRef={conversationRef}
                      />
                    </Suspense>
                  )}
                </article>
              ))}
              {isMessagesLoading && <p className="dashboard-chat-status" role="status">Opening your conversation...</p>}
              {isLoading && <p className="dashboard-chat-status" role="status">Nexora is thinking...</p>}
              {error && <p className="dashboard-chat-error" role="alert">{error}</p>}
              {messages.length === 0 && !isMessagesLoading && !isLoading && !error && (
                <p className="dashboard-preview__empty">Your conversation will appear here.</p>
              )}
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
              <button className="dashboard-send-button" type="button" aria-label="Send message" disabled={isLoading || isMessagesLoading || !draft.trim()} onClick={handleSendMessage}><Icon name="send" size={16} /></button>
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}

export default Dashboard
