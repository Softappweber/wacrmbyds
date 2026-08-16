// Use the global supabase from CDN - DO NOT redeclare it
// const supabase = window.supabase.createClient(...) ← REMOVE THIS

const SUPABASE_URL = 'https://xeqxttprjzmhfcdnyhlm.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_QNRcYI3KaHNUr2hKF_d28Q_3TKjT5cf';

// Create client without const supabase (assign to window)
window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Auth State Change Listener
window.supabaseClient.auth.onAuthStateChange((event, session) => {
    if (session?.user) {
        showDashboard(session.user);
    } else {
        showLogin();
    }
});

function showLogin() {
    document.getElementById('loginScreen').style.display = 'block';
    document.getElementById('mainApp').style.display = 'none';
}

function showDashboard(user) {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
    document.getElementById('userDisplay').textContent = `Welcome, ${user.email}`;
    loadDashboard();
}

function showAuth(type) {
    if (type === 'login') {
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('signupForm').style.display = 'none';
    } else {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('signupForm').style.display = 'block';
    }
}

async function signup() {
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    const { data, error } = await window.supabaseClient.auth.signUp({
        email: email,
        password: password
    });
    
    if (error) {
        document.getElementById('authMessage').textContent = error.message;
        document.getElementById('authMessage').className = 'text-danger mt-2';
    } else {
        document.getElementById('authMessage').textContent = 'Sign up successful! Check your email if confirmation is required.';
        document.getElementById('authMessage').className = 'text-success mt-2';
    }
}

async function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const { data, error } = await window.supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    });
    
    if (error) {
        document.getElementById('authMessage').textContent = error.message;
        document.getElementById('authMessage').className = 'text-danger mt-2';
    }
}

async function logout() {
    await window.supabaseClient.auth.signOut();
}

async function loadDashboard() {
    const { data: { user } } = await window.supabaseClient.auth.getUser();
    if (!user) return;
    
    const { data: leads, error } = await window.supabaseClient
        .from('leads')
        .select('*')
        .eq('user_id', user.id);
    
    if (leads) {
        document.getElementById('totalLeads').textContent = leads.length;
        
        const activeLeads = leads.filter(lead => lead.status !== 'Converted' && lead.status !== 'Lost');
        document.getElementById('activeLeads').textContent = activeLeads.length;
        
        const convertedLeads = leads.filter(lead => lead.status === 'Converted');
        document.getElementById('convertedLeads').textContent = convertedLeads.length;
    }
}

window.onload = async function() {
    const { data: { session } } = await window.supabaseClient.auth.getSession();
    if (session?.user) {
        showDashboard(session.user);
    } else {
        showLogin();
    }
};
