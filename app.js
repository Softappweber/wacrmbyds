// Supabase Configuration
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_PUBLISHABLE_KEY = 'YOUR_SUPABASE_PUBLISHABLE_KEY';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Auth State Change Listener - This is the critical part
supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user) {
        showDashboard(session.user);
    } else {
        showLogin();
    }
});

// Show Login
function showLogin() {
    document.getElementById('loginScreen').style.display = 'block';
    document.getElementById('mainApp').style.display = 'none';
}

// Show Dashboard
function showDashboard(user) {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
    document.getElementById('userDisplay').textContent = `Welcome, ${user.email}`;
    loadDashboard();
}

// Auth Tab Switching
function showAuth(type) {
    if (type === 'login') {
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('signupForm').style.display = 'none';
    } else {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('signupForm').style.display = 'block';
    }
}

// Sign Up
async function signup() {
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    const { data, error } = await supabase.auth.signUp({
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

// Login
async function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });
    
    if (error) {
        document.getElementById('authMessage').textContent = error.message;
        document.getElementById('authMessage').className = 'text-danger mt-2';
    }
    // No else needed - onAuthStateChange handles dashboard display
}

// Logout
async function logout() {
    await supabase.auth.signOut();
    // onAuthStateChange handles UI switch
}

// Dashboard Data
async function loadDashboard() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    const { data: leads, error } = await supabase
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

// Initial Check on Page Load
window.onload = async function() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
        showDashboard(session.user);
    } else {
        showLogin();
    }
};
