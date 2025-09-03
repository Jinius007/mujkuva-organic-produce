# 🗄️ Supabase Database Setup Guide

## 🚨 **CRITICAL: Your Supabase Connection is Failing Because the Database Schema is Missing!**

The website can't upload files or save orders because the required database tables and storage buckets don't exist yet.

## 🔧 **How to Fix This (Choose One Method):**

### **Method 1: Supabase Dashboard (Easiest - Recommended)**

1. **Go to your Supabase project:**
   - Open: `https://zjjjajkzavxytdexkbrj.supabase.co`
   - Login with your Supabase credentials

2. **Navigate to SQL Editor:**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Copy and paste the complete setup script:**
   - Open the file: `supabase/setup-complete-database.sql`
   - Copy ALL the content
   - Paste it into the SQL Editor

4. **Run the script:**
   - Click the "Run" button (▶️)
   - Wait for all commands to complete

5. **Verify success:**
   - You should see multiple ✅ success messages
   - The final message should be: "🎉 Database setup complete!"

### **Method 2: Supabase CLI (Advanced Users)**

```bash
# Install Supabase CLI
npm install -g @supabase/cli

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref zjjjajkzavxytdexkbrj

# Run migrations
supabase db push
```

## ✅ **What This Script Creates:**

### **Database Tables:**
- `order_slots` - Stores all order information
- Proper indexes for performance
- Automatic timestamp updates

### **Storage Buckets:**
- `payment_screenshots` - For storing payment images
- Public access enabled
- 5MB file size limit
- Supports: JPEG, PNG, GIF, WebP

### **Security Policies:**
- Row Level Security (RLS) enabled
- Public read/write access for orders
- Public upload/download for files

## 🧪 **After Running the Script:**

1. **Wait for Vercel deployment** (2-3 minutes)
2. **Go to checkout page** on your website
3. **Click "🧪 Test Supabase Connection" button**
4. **Check console** - should now show:
   ```
   ✅ Basic connection successful
   ✅ Storage bucket access successful
   All Supabase tests passed!
   ```

## 🚨 **If You Get Errors:**

### **Common Issues:**
- **Permission denied**: Make sure you're logged in as project owner
- **Table already exists**: That's fine, the script handles it
- **Bucket already exists**: That's fine, the script updates it

### **Need Help?**
- Check the error message in Supabase SQL Editor
- The script includes verification queries to show what's working

## 🎯 **Expected Results:**

After running the script, you should see:
```
✅ order_slots table - CREATED
✅ payment_screenshots bucket - CREATED  
✅ bucket public access - PUBLIC
✅ Test order insert - SUCCESS
🎉 Database setup complete!
```

## 🔒 **Security Note:**

The script creates public access policies because this is a public ordering website. Customers need to be able to:
- Upload payment screenshots
- Create orders
- View their order status

---

**Once you run this script, your website will work perfectly!** 🚀
