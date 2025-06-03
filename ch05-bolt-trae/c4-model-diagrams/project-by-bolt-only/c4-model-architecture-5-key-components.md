# C4 Model Architecture - 5 Key Components

This document contains simplified C4 model diagrams focusing on the 5 most frequently modified components during product development and prototyping.

## C4 Context Diagram

```mermaid
C4Context
    title System Context diagram for AI Prompt Optimizer

    Person(user, "User", "End user who wants to optimize AI prompts")
    
    System(promptOptimizer, "AI Prompt Optimizer", "Web application for optimizing AI prompts with history tracking and user management")
    
    System_Ext(browser, "Web Browser", "Chrome, Firefox, Safari, etc.")
    System_Ext(localStorage, "Browser Storage", "Local storage for user data and optimization history")
    System_Ext(deepseekAPI, "DeepSeek API", "External AI service for intelligent prompt optimization (fallback to local optimization)")

    Rel(user, browser, "Uses")
    Rel(browser, promptOptimizer, "Loads and interacts with", "HTTPS")
    Rel(promptOptimizer, localStorage, "Stores user data and history", "Web Storage API")
    Rel(promptOptimizer, deepseekAPI, "Calls for intelligent optimization", "HTTPS/REST API")
```

## C4 Container Diagram

```mermaid
C4Container
    title Container diagram for AI Prompt Optimizer

    Person(user, "User", "End user who wants to optimize AI prompts")
    
    System_Ext(browser, "Web Browser", "Chrome, Firefox, Safari, etc.")
    System_Ext(localStorage, "Browser Storage", "Local storage for user data and optimization history")
    System_Ext(deepseekAPI, "DeepSeek API", "External AI service for intelligent prompt optimization")

    Container_Boundary(promptOptimizerSystem, "AI Prompt Optimizer System") {
        Container(nextjsApp, "Next.js Application", "React 18.2.0, Next.js 13.5.1, TypeScript 5.2.2, Tailwind CSS 3.3.3", "Single-page application providing prompt optimization interface with UI components, state management, and optimization logic")
    }

    Rel(user, browser, "Uses")
    Rel(browser, nextjsApp, "Loads and interacts with", "HTTPS")
    Rel(nextjsApp, localStorage, "Stores/retrieves user data and history", "Web Storage API")
    Rel(nextjsApp, deepseekAPI, "Calls for intelligent optimization", "HTTPS/REST API")
```

## C4 Component Diagram - Key Components Only

```mermaid
C4Component
    title Component diagram for Next.js Application - Key Components for Product Development

    Person(user, "User", "End user who wants to optimize AI prompts")
    System_Ext(browser, "Web Browser", "Chrome, Firefox, Safari, etc.")
    System_Ext(localStorage, "Browser Storage", "Local storage for user data and optimization history")
    System_Ext(deepseekAPI, "DeepSeek API", "External AI service for intelligent prompt optimization")

    Container_Boundary(nextjsApp, "Next.js Application - Key Components") {
        ComponentDb(promptOptimizer, "Prompt Optimizer", "components/features/prompt-optimizer.tsx", "Main feature component for prompt optimization UI and interaction logic")
        ComponentDb(sidebar, "Sidebar Component", "components/layouts/sidebar.tsx", "History display and user interaction interface")
        ComponentDb(authDialog, "Auth Dialog", "components/features/auth-dialog.tsx", "User authentication flow (login/signup/settings)")
        
        ComponentDb(useOptimizer, "useOptimizer Hook", "hooks/use-optimizer.ts", "Core prompt optimization algorithm and API call logic")
        ComponentDb(translations, "Translations", "lib/translations.ts", "Multi-language text definitions and internationalization")
    }

    Rel(user, browser, "Uses")
    Rel(browser, promptOptimizer, "Interacts with main feature", "HTTPS")
    Rel(browser, sidebar, "Views history and profile", "HTTPS")
    Rel(browser, authDialog, "Authenticates", "HTTPS")
    
    Rel(promptOptimizer, useOptimizer, "Calls optimization logic")
    Rel(promptOptimizer, translations, "Gets UI text")
    Rel(sidebar, translations, "Gets UI text")
    Rel(authDialog, translations, "Gets UI text")
    
    Rel(sidebar, localStorage, "Stores/retrieves history", "Web Storage API")
    Rel(authDialog, localStorage, "Stores/retrieves user data", "Web Storage API")
    Rel(useOptimizer, deepseekAPI, "Calls for intelligent optimization", "HTTPS/REST API")
```

## Key Components Overview

### 1. Prompt Optimizer (`components/features/prompt-optimizer.tsx`)
- **Purpose**: Main UI component for prompt input, optimization trigger, and result display
- **PM Focus**: User experience, input validation, loading states, result presentation
- **Frequent Changes**: UI layout, interaction flows, validation rules

### 2. Optimization Logic (`hooks/use-optimizer.ts`)
- **Purpose**: Core business logic for prompt optimization with API integration and fallback
- **PM Focus**: Optimization algorithms, API integration, error handling strategies
- **Frequent Changes**: Optimization rules, API endpoints, fallback logic

### 3. Translations (`lib/translations.ts`)
- **Purpose**: Multi-language support for all user-facing text
- **PM Focus**: Content strategy, user messaging, internationalization
- **Frequent Changes**: New text additions, content updates, language support

### 4. Sidebar (`components/layouts/sidebar.tsx`)
- **Purpose**: History management and user profile interface
- **PM Focus**: History organization, user engagement, navigation patterns
- **Frequent Changes**: History display logic, user interaction patterns

### 5. Auth Dialog (`components/features/auth-dialog.tsx`)
- **Purpose**: User authentication and account management
- **PM Focus**: User onboarding, authentication flow, account settings
- **Frequent Changes**: Registration flow, user data collection, settings options

## Development Priority

These 5 components represent the core product functionality that product managers typically iterate on during:
- Feature development and enhancement
- User experience optimization
- Content and messaging updates
- Business logic refinement
- User flow improvements 