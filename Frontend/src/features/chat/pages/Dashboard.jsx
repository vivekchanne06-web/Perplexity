import { useSelector } from "react-redux"
import { useChat } from "../hooks/useChat"
import { useEffect, useState, useRef, useMemo } from "react"
import { useDispatch } from "react-redux"
import { setCurrentChatId } from "../chat.slice"
import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm"
import PerplexityLogo from '../../../assets/perplexity-ai-icon.webp'
import { useAuth } from "../../auth/hook/useAuth"
import { useNavigate } from "react-router"


const Dashboard = () => {
  const { initializeSocketConnection, handleGetChats, handleSendMessage, handleOpenChat: openChat, handleDeleteChat } = useChat()

  const { handleLogout } = useAuth()

  const textareaRef = useRef(null);

  const navigate = useNavigate()

  const dispatch = useDispatch()

  const { user } = useSelector(state => state.auth)
  const { chats, currentChatId } = useSelector(state => state.chat)

  const messages = useMemo(() => chats[currentChatId]?.messages || [], [chats, currentChatId])
  const chatList = Object.values(chats).filter(chat => chat?.id)

  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const messagesEndRef = useRef(null)
  const initialLoadRef = useRef({ initializeSocketConnection, handleGetChats })

  useEffect(() => {
    initialLoadRef.current = { initializeSocketConnection, handleGetChats }
  }, [initializeSocketConnection, handleGetChats])

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsInitialLoading(true)
        await initialLoadRef.current.initializeSocketConnection()
        await initialLoadRef.current.handleGetChats()
      } catch (error) {
        console.error("Failed to initialize:", error)
      } finally {
        setIsInitialLoading(false)
      }
    }

    initializeApp()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    setIsLoading(true)
    try {
      await handleSendMessage({
        message: inputValue,
        chatId: currentChatId || null,
      });
      setInputValue("")
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }

    } catch (error) {
      console.error("Failed to send message:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !isLoading) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleNewChat = () => {
    setSidebarOpen(false)
    dispatch(setCurrentChatId(null));
  }

  const handleOpenChat = async (chatId) => {
    setSidebarOpen(false)
    openChat(chatId);
  }

  const handleLog = async () => {
    await handleLogout()
    navigate("/login");
  }

  const handleInputChange = (e) => {
    setInputValue(e.target.value);

    const textarea = textareaRef.current;
    textarea.style.height = "auto"; // reset
    textarea.style.height = textarea.scrollHeight + "px"; // grow
  };

  // Loading Skeleton Component
  const SkeletonLoader = () => (
    <div className="flex gap-4 items-start animate-pulse">
      <div className="shrink-0 w-8 h-8 rounded-lg bg-gray-300"></div>
      <div className="flex-1 space-y-3">
        <div className="h-6 bg-gray-300 rounded w-1/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/5"></div>
        </div>
        <div className="space-y-2 pt-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  )

  // Typing Indicator Component
  const TypingIndicator = () => (
    <div className="flex gap-4 items-start">
      <div className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-black text-white">
        <img src={PerplexityLogo} alt="AI" className="w-5 h-5" />
      </div>
      <div className="flex items-center gap-1.5 py-2 px-4 rounded-lg bg-gray-100">
        <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "0s" }}></span>
        <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "0.2s" }}></span>
        <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "0.4s" }}></span>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">

      {/* ── MOBILE SIDEBAR OVERLAY ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* ── SIDEBAR ── */}
      <aside className={`flex flex-col w-64 shrink-0 border-r border-gray-200 bg-white py-6 px-4 fixed md:static h-full z-50 md:z-auto transition-transform md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>

        {/* Close Button for Mobile */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="md:hidden absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Logo/Title */}
        <div className="flex items-center gap-2 mb-6 px-2">
          <div className="w-8 h-8 rounded-md bg-black flex items-center justify-center overflow-hidden">
            <img src={PerplexityLogo} alt="Perplexity" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-black">Perplexity</h1>
            <p className="text-xs text-gray-500">AI ASSISTANT</p>
          </div>
        </div>

        {/* New Chat Button */}
        <button
          onClick={handleNewChat}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl mb-6 text-sm font-semibold text-white transition-all bg-black hover:bg-gray-900 active:scale-95 disabled:opacity-50 w-full"
          disabled={isInitialLoading}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">New Chat</span>
        </button>

        {/* Chat history */}
        <p className="text-xs font-medium uppercase tracking-widest px-2 mb-3 text-gray-400">Recent Activity</p>
        <nav className="flex flex-col gap-2 flex-1 overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "#e5e7eb white" }}>
          {isInitialLoading ? (
            // Skeleton loaders for chat list
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : (
            chatList.map(chat => (
              <div
                key={chat.id}
                className="flex items-center justify-between group px-3 py-2.5 rounded-lg transition-all hover:bg-gray-100"
                style={{
                  background: currentChatId === chat.id ? "#f3f4f6" : "transparent",
                }}
              >
                {/* Chat Click Area */}
                <button
                  onClick={() => handleOpenChat(chat.id)}
                  className="flex items-center gap-2 text-left text-sm truncate flex-1"
                  style={{
                    color: currentChatId === chat.id ? "#000" : "#6b7280",
                  }}
                >
                  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="4" y="4" width="4" height="4" rx="1" />
                    <rect x="10" y="4" width="4" height="4" rx="1" />
                    <rect x="16" y="4" width="4" height="4" rx="1" />
                  </svg>
                  <span className="truncate font-medium text-xs sm:text-sm">{chat.title}</span>
                </button>

                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const confirmDelete = window.confirm("Delete this chat?");
                    if (confirmDelete) {
                      handleDeleteChat(chat.id);
                    }
                  }}
                  className="opacity-0 group-hover:opacity-100 transition text-gray-400 hover:text-red-500 ml-2 text-lg"
                  title="Delete Chat"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </nav>

        {/* Logout */}
        <div className="pt-4 border-t border-gray-200 mt-auto">
          <button
            onClick={handleLog}
            className="w-full flex items-center justify-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 transition-all hover:text-red-600 hover:bg-red-50"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
            </svg>
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="flex flex-col flex-1 overflow-hidden bg-white w-full">

        {/* Top bar */}
        <header className="flex items-center justify-between px-4 sm:px-8 py-4 border-b border-gray-200 shrink-0 gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg sm:text-xl font-semibold text-black flex-1">Perplexity AI</h1>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold cursor-pointer bg-black text-white hover:bg-gray-900 transition shrink-0"
            title={user?.name || user?.email || "User"}
          >
            {(user?.name?.[0] || user?.email?.[0] || "A").toUpperCase()}
          </div>
        </header>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 md:px-12 py-8 sm:py-12 space-y-8" style={{ scrollbarWidth: "thin" }}>

          {/* Initial Loading State */}
          {isInitialLoading && messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="space-y-8">
                {/* Animated loader */}
                <div className="flex justify-center">
                  <div className="relative w-12 h-12">
                    <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </div>
                <p className="text-gray-500 text-center text-sm">Loading your chats...</p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            /* Empty State - Show when no messages */
            <div className="flex flex-col items-center justify-center h-full space-y-8 sm:space-y-12">
              <div className="text-center max-w-2xl px-4">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                  How can I <span className="text-gray-400">help you</span> today?
                </h2>
              </div>

              {/* Quick Action Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full max-w-2xl px-4">
                <button className="group text-left p-4 sm:p-5 rounded-2xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="text-2xl mt-0.5">✏️</div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-black text-sm sm:text-base">Creative Writing</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">Generate a short story about a neon-lit futuristic city.</p>
                </button>

                <button className="group text-left p-4 sm:p-5 rounded-2xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="text-2xl mt-0.5">⚙️</div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-black text-sm sm:text-base">Code Refactor</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">Analyze my JavaScript code and suggest performance improvements.</p>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Messages */}
              {messages.map((msg, index) => (
                <div key={index} className="w-full">
                  {msg.role === "user" ? (
                    <div className="flex justify-end">
                      <div className="max-w-xs sm:max-w-sm md:max-w-xl rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-sm leading-relaxed bg-gray-100 text-gray-900">
                        {msg.content}
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3 sm:gap-4 items-start">
                      {/* AI icon */}
                      <div className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-black text-white mt-0.5">
                        <img src={PerplexityLogo} alt="AI" className="w-5 h-5" />
                      </div>

                      <div className="flex-1 space-y-4 min-w-0">
                        {msg.title && (
                          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">
                            {msg.title}
                          </h2>
                        )}

                        {/* Markdown Content */}
                        <div className="prose prose-sm max-w-none text-gray-700 overflow-x-auto">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              h1: ({ children }) => <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">{children}</h1>,
                              h2: ({ children }) => <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">{children}</h2>,
                              h3: ({ children }) => <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">{children}</h3>,
                              p: ({ children }) => <p className="text-xs sm:text-sm leading-6 sm:leading-7 text-gray-700 mb-3 sm:mb-4">{children}</p>,
                              ul: ({ children }) => <ul className="list-disc pl-4 sm:pl-5 space-y-1 sm:space-y-2 mb-3 sm:mb-4 text-gray-700">{children}</ul>,
                              ol: ({ children }) => <ol className="list-decimal pl-4 sm:pl-5 space-y-1 sm:space-y-2 mb-3 sm:mb-4 text-gray-700">{children}</ol>,
                              li: ({ children }) => <li className="text-xs sm:text-sm text-gray-700">{children}</li>,
                              blockquote: ({ children }) => (
                                <blockquote className="border-l-4 border-gray-300 pl-3 sm:pl-4 italic text-gray-600 my-3 sm:my-4 text-xs sm:text-sm">
                                  {children}
                                </blockquote>
                              ),
                              a: ({ href, children }) => (
                                <a href={href} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-700 underline underline-offset-2 break-all">
                                  {children}
                                </a>
                              ),
                              hr: () => <hr className="border-gray-200 my-3 sm:my-4" />,
                              table: ({ children }) => <div className="overflow-x-auto"><table className="w-full border border-gray-200 rounded-lg overflow-hidden my-3 sm:my-4 text-xs sm:text-sm">{children}</table></div>,
                              thead: ({ children }) => <thead className="bg-gray-100">{children}</thead>,
                              tbody: ({ children }) => <tbody className="bg-white">{children}</tbody>,
                              tr: ({ children }) => <tr className="border-b border-gray-200">{children}</tr>,
                              th: ({ children }) => <th className="text-left px-2 sm:px-4 py-2 text-xs font-semibold text-gray-900">{children}</th>,
                              td: ({ children }) => <td className="px-2 sm:px-4 py-2 text-xs text-gray-700">{children}</td>,
                              code({ inline, children }) {
                                return !inline ? (
                                  <pre className="bg-gray-100 p-3 sm:p-4 rounded-lg overflow-x-auto border border-gray-200 my-3 sm:my-4">
                                    <code className="text-gray-900 text-xs leading-6 font-mono block">
                                      {children}
                                    </code>
                                  </pre>
                                ) : (
                                  <code className="bg-gray-200 px-2 py-1 rounded text-gray-900 text-xs font-mono break-all">
                                    {children}
                                  </code>
                                );
                              }
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        </div>

                        {/* Cards */}
                        {msg.cards && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4">
                            {msg.cards.map((card, i) => (
                              <div key={i} className="rounded-xl p-3 sm:p-4 bg-gray-50 border border-gray-200">
                                <div className="flex items-start gap-2 mb-2">
                                  <span className="text-lg">{card.icon === "layers" ? "📚" : "🎯"}</span>
                                  <p className="text-xs sm:text-sm font-semibold text-gray-900">{card.title}</p>
                                </div>
                                <p className="text-xs text-gray-600 leading-relaxed">{card.body}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Quote */}
                        {msg.quote && (
                          <div className="flex gap-3 items-start py-2 px-3 bg-gray-50 rounded-lg border-l-2 border-gray-300">
                            <p className="text-xs sm:text-sm italic text-gray-600">"{msg.quote}"</p>
                          </div>
                        )}

                        {/* Tags */}
                        {msg.tags && (
                          <div className="flex flex-wrap gap-2 pt-2">
                            {msg.tags.map((tag, i) => (
                              <span key={i} className="px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Loading indicator while AI is typing */}
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Bar */}
        <div className="px-4 sm:px-8 pb-6 sm:pb-8 pt-3 sm:pt-4 shrink-0">
          <div className="rounded-2xl px-4 sm:px-6 py-3 sm:py-4 flex items-end gap-2 sm:gap-3 border border-gray-200 bg-white hover:border-gray-300 transition"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>

            {/* Attachment Button */}
            <button
              className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 transition disabled:opacity-50"
              disabled={isLoading}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>

            {/* Input Field */}
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Message Perplexity AI..."
              rows={1}
              disabled={isLoading}
              className="flex-1 bg-transparent text-sm resize-none outline-none leading-relaxed max-h-32 no-scrollbar overflow-y-auto text-gray-900 placeholder-gray-400 disabled:opacity-50"
            />

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed relative"
              style={{
                background: (inputValue.trim() && !isLoading) ? "#000" : "#e5e7eb",
                color: (inputValue.trim() && !isLoading) ? "#fff" : "#9ca3af",
              }}
            >
              {isLoading ? (
                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              )}
            </button>
          </div>
          {isLoading && (
            <p className="text-xs text-gray-500 mt-2 text-center">AI is thinking...</p>
          )}
        </div>
      </main>
    </div>
  )
}

export default Dashboard

