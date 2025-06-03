import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// 使用内存存储session数据（重启服务会清除）
const sessionStore = new Map<string, { apiKey: string; timestamp: number }>();

// Session 过期时间（24小时）
const SESSION_EXPIRE_TIME = 24 * 60 * 60 * 1000;

// 生成简单的session ID
function generateSessionId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// 清理过期的session
function cleanExpiredSessions() {
  const now = Date.now();
  for (const [sessionId, data] of sessionStore.entries()) {
    if (now - data.timestamp > SESSION_EXPIRE_TIME) {
      sessionStore.delete(sessionId);
    }
  }
}

// POST: 存储API密钥
export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json();
    
    if (!apiKey || typeof apiKey !== 'string') {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 400 });
    }

    // 清理过期session
    cleanExpiredSessions();

    const cookieStore = cookies();
    let sessionId = cookieStore.get('session-id')?.value;

    // 如果没有session ID，创建新的
    if (!sessionId) {
      sessionId = generateSessionId();
    }

    // 存储API密钥
    sessionStore.set(sessionId, {
      apiKey,
      timestamp: Date.now()
    });

    console.log(`🔐 API密钥已安全存储到后端session: ${sessionId.substring(0, 8)}...`);

    // 设置session cookie（仅在浏览器session期间有效）
    const response = NextResponse.json({ success: true });
    response.cookies.set('session-id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_EXPIRE_TIME / 1000 // 24小时
    });

    return response;
  } catch (error) {
    console.error('存储API密钥时出错:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET: 获取API密钥
export async function GET(request: NextRequest) {
  try {
    // 清理过期session
    cleanExpiredSessions();

    const cookieStore = cookies();
    const sessionId = cookieStore.get('session-id')?.value;

    if (!sessionId) {
      return NextResponse.json({ hasApiKey: false });
    }

    const sessionData = sessionStore.get(sessionId);
    
    if (!sessionData) {
      return NextResponse.json({ hasApiKey: false });
    }

    // 检查是否过期
    if (Date.now() - sessionData.timestamp > SESSION_EXPIRE_TIME) {
      sessionStore.delete(sessionId);
      return NextResponse.json({ hasApiKey: false });
    }

    console.log(`🔍 从后端session获取API密钥: ${sessionId.substring(0, 8)}...`);
    
    return NextResponse.json({ 
      hasApiKey: true,
      apiKey: sessionData.apiKey 
    });
  } catch (error) {
    console.error('获取API密钥时出错:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE: 清除API密钥
export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const sessionId = cookieStore.get('session-id')?.value;

    if (sessionId && sessionStore.has(sessionId)) {
      sessionStore.delete(sessionId);
      console.log(`🗑️ 已清除后端session中的API密钥: ${sessionId.substring(0, 8)}...`);
    }

    const response = NextResponse.json({ success: true });
    response.cookies.delete('session-id');
    
    return response;
  } catch (error) {
    console.error('清除API密钥时出错:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 