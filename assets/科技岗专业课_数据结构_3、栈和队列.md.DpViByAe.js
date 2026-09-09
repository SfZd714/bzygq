import{_ as a,o as p,c as l,a2 as e}from"./chunks/framework.F7eQ-ohH.js";const i="/bzygq/assets/quesion_imgs_3319f73d7d2a4f62be010e50b76df475.Bd1NDgqc.png",t="/bzygq/assets/quesion_imgs_fe67a713c6f64b839738ce12e9609af2.BunYW2L4.png",c="/bzygq/assets/quesion_imgs_7ce568906c6445daaec1964787d61819.BgFGgHFI.png",s="/bzygq/assets/quesion_imgs_5c1afbefef24437199a9bd415a2b5960.D0ruHkjg.png",r="/bzygq/assets/quesion_imgs_cafd9fcd6dee47b88615e016443924e8.DQLcBKqq.png",o="/bzygq/assets/quesion_imgs_b9536179dedc4d569dbc866052d0e3ca.BD2OMGQ0.png",v=JSON.parse('{"title":"3、栈和队列","description":"","frontmatter":{},"headers":[],"relativePath":"科技岗专业课/数据结构/3、栈和队列.md","filePath":"科技岗专业课/数据结构/3、栈和队列.md","lastUpdated":1788883925000}'),u={name:"科技岗专业课/数据结构/3、栈和队列.md"};function h(d,n,b,g,m,q){return p(),l("div",null,[...n[0]||(n[0]=[e('<h1 id="_3、栈和队列" tabindex="-1">3、栈和队列 <a class="header-anchor" href="#_3、栈和队列" aria-label="Permalink to &quot;3、栈和队列&quot;">​</a></h1><p><strong>Part 03：栈和队列</strong></p><table tabindex="0"><thead><tr><th>【原创声明】大家好，我是say，是这篇文章的原创作者！985硕士毕业，应届进入某大厂后道心破碎，社招上岸多家855半垄断央企，因为自己淋过雨，希望帮大家撑把伞，帮助更多同学找到不内卷、能够好好生活的央国企，已帮助1000+同学上岸央国企，需要连联系学长的加微信：wx_hxsay</th></tr></thead></table><h1 id="队列" tabindex="-1">队列 <a class="header-anchor" href="#队列" aria-label="Permalink to &quot;队列&quot;">​</a></h1><h2 id="队列的定义" tabindex="-1">队列的定义 <a class="header-anchor" href="#队列的定义" aria-label="Permalink to &quot;队列的定义&quot;">​</a></h2><p><img src="'+i+'" alt=""></p><p>队列（Queue）是一种<strong>运算受限</strong>的线性表。队列只允许在一端进行插入操作（队尾，rear），而在另一端进行删除操作（队头，front），这种特性使得队列具有**“先进先出”（First-In-First-Out, FIFO）**的特点。</p><h2 id="队列的特点-先进先出-fifo" tabindex="-1">队列的特点：先进先出（FIFO） <a class="header-anchor" href="#队列的特点-先进先出-fifo" aria-label="Permalink to &quot;队列的特点：先进先出（FIFO）&quot;">​</a></h2><p><img src="'+t+'" alt=""></p><ol><li><strong>循环队列判空条件</strong>：当 front == rear 时，队列为空。</li><li><strong>循环队列判满条件</strong>：当 (rear + 1) % MAXSIZE == front 时，队列为满。</li><li><strong>求队列中的元素个数</strong>：队列中的元素个数可以通过公式 (rear - front + MAXSIZE) % MAXSIZE 计算得出。</li><li><strong>插入操作</strong>：在队尾插入元素，操作为 rear = (rear + 1) % MAXSIZE，然后将新元素放入 queue[rear]。</li><li><strong>删除操作</strong>：从队头删除元素，操作为 front = (front + 1) % MAXSIZE，然后返回 queue[front]。</li></ol><h2 id="队列分类" tabindex="-1">队列分类 <a class="header-anchor" href="#队列分类" aria-label="Permalink to &quot;队列分类&quot;">​</a></h2><p>在数据结构中，队列作为一种重要的抽象数据类型，可以根据其特性和实现方式被分类为几种不同类型。以下是数据结构中队列的主要分类：</p><p><img src="'+c+`" alt=""></p><ol><li><p>**单向队列 (Simple Queue)：**单向队列是最基础的队列形式，它遵循先进先出（FIFO）原则。所有新元素都添加到队列的尾部，而移除操作则始终从队列的头部开始。</p></li><li><p>**循环队列 (Circular Queue)：**循环队列是对单向队列的优化，通过将队列的最后一个位置与第一个位置相连形成一个环形结构。这有助于更高效地利用数组空间，避免了普通队列可能出现的空间浪费问题。</p></li><li><p>**双端队列 (Deque, Double-Ended Queue)：**双端队列允许在队列的两端进行插入和删除操作。这意味着可以在队列的前端或后端添加或移除元素，提供了一种更加灵活的数据结构形式。</p></li></ol><h2 id="队列的应用" tabindex="-1">队列的应用 <a class="header-anchor" href="#队列的应用" aria-label="Permalink to &quot;队列的应用&quot;">​</a></h2><p>队列在信息处理中常用于逐层或逐行处理问题。这类问题的解决方法通常是在处理当前层或当前行时，预先处理下一层或下一行，并安排好处理顺序。使用队列可以有效地保存下一步的处理顺序。此外，队列在计算机系统中应用广泛，主要体现在以下几个方面：</p><ol><li><p><strong>解决主机与外部设备之间的速度不匹配问题</strong>：在主机与外部设备（如打印机、磁盘驱动器等）进行数据传输时，由于主机的处理速度远高于外部设备，可能会导致数据丢失或溢出。通过使用队列，可以缓冲数据，使得主机和外部设备之间的数据传输更加平滑。</p></li><li><p><strong>解决多用户资源竞争问题</strong>：在多用户操作系统中，多个用户可能同时请求某种资源（如打印机、文件系统等）。通过队列可以管理这些请求，确保每个用户都能按顺序获得资源，避免资源竞争和冲突。</p></li><li><p><strong>任务调度</strong>：在操作系统中，任务调度器使用队列来管理进程的执行顺序。每个进程按照进入队列的顺序依次执行，确保系统的公平性和效率。</p></li><li><p><strong>消息传递</strong>：在分布式系统中，不同节点之间通过消息传递进行通信。消息队列可以确保消息的有序传递，保证系统的可靠性和一致性。</p></li></ol><h2 id="队列的基本操作" tabindex="-1">队列的基本操作 <a class="header-anchor" href="#队列的基本操作" aria-label="Permalink to &quot;队列的基本操作&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class MyQueue {</span></span>
<span class="line"><span>    private int[] array;</span></span>
<span class="line"><span>    private int front;</span></span>
<span class="line"><span>    private int rear;</span></span>
<span class="line"><span>    private int size;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public MyQueue(int capacity) {</span></span>
<span class="line"><span>        array = new int[capacity];</span></span>
<span class="line"><span>        front = 0;</span></span>
<span class="line"><span>        rear = -1;</span></span>
<span class="line"><span>        size = 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 入队操作</span></span>
<span class="line"><span>    public boolean offer(int value) {</span></span>
<span class="line"><span>        if (size == array.length) {</span></span>
<span class="line"><span>            return false; // 队列已满</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        rear = (rear + 1) % array.length;</span></span>
<span class="line"><span>        array[rear] = value;</span></span>
<span class="line"><span>        size++;</span></span>
<span class="line"><span>        return true;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 出队操作</span></span>
<span class="line"><span>    public Integer poll() {</span></span>
<span class="line"><span>        if (size == 0) {</span></span>
<span class="line"><span>            return null; // 队列为空</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        int result = array[front];</span></span>
<span class="line"><span>        front = (front + 1) % array.length;</span></span>
<span class="line"><span>        size--;</span></span>
<span class="line"><span>        return result;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 查看队首元素</span></span>
<span class="line"><span>    public Integer peek() {</span></span>
<span class="line"><span>        if (size == 0) {</span></span>
<span class="line"><span>            return null; // 队列为空</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return array[front];</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 检查队列是否为空</span></span>
<span class="line"><span>    public boolean isEmpty() {</span></span>
<span class="line"><span>        return size == 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 查看队列的大小</span></span>
<span class="line"><span>    public int size() {</span></span>
<span class="line"><span>        return size;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class ManualQueueImplementation {</span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        MyQueue queue = new MyQueue(5);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 入队操作</span></span>
<span class="line"><span>        queue.offer(10);</span></span>
<span class="line"><span>        queue.offer(20);</span></span>
<span class="line"><span>        queue.offer(30);</span></span>
<span class="line"><span>        System.out.println(&quot;入队后的队列是否为空: &quot; + queue.isEmpty());</span></span>
<span class="line"><span>        System.out.println(&quot;队首元素: &quot; + queue.peek());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 出队操作</span></span>
<span class="line"><span>        Integer removed = queue.poll();</span></span>
<span class="line"><span>        System.out.println(&quot;出队的元素: &quot; + removed);</span></span>
<span class="line"><span>        System.out.println(&quot;出队后的队列大小: &quot; + queue.size());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h1 id="栈" tabindex="-1">栈 <a class="header-anchor" href="#栈" aria-label="Permalink to &quot;栈&quot;">​</a></h1><h2 id="栈的定义" tabindex="-1">栈的定义 <a class="header-anchor" href="#栈的定义" aria-label="Permalink to &quot;栈的定义&quot;">​</a></h2><p><img src="`+s+'" alt=""></p><p>栈（Stack），也称堆栈，是一种<strong>运算受限的线性表</strong>。栈只允许在<strong>表的一端进行插入和删除操作</strong>，这一端称为<strong>栈顶</strong>，而另一端称为<strong>栈底</strong>。向栈中插入新元素的操作称为进栈、入栈或压栈，即将新元素放置在栈顶元素之上，使其成为新的栈顶元素；从栈中删除元素的操作称为出栈或退栈，即删除栈顶元素，使其相邻的元素成为新的栈顶元素。这种特性使得栈具有**“先进后出”**（Last-In-First-Out, LIFO）的特点。</p><h2 id="栈的特点-先进后出" tabindex="-1">栈的特点：先进后出 <a class="header-anchor" href="#栈的特点-先进后出" aria-label="Permalink to &quot;栈的特点：先进后出&quot;">​</a></h2><p><img src="'+r+'" alt=""></p><ul><li><strong>栈的存储结构</strong>：</li><li><strong>顺序栈</strong>：使用数组实现，栈的大小固定。</li><li><strong>链式栈</strong>：使用链表实现，栈的大小动态变化。</li><li><strong>栈的判空条件</strong>：当 S.top == -1 时，栈为空。</li><li><strong>栈的判满条件</strong>：当 S.top == MAXSIZE - 1 时，栈为满。</li><li><strong>进栈操作</strong>：先将 S.top 增加 1，然后将新元素放入 S.data[S.top]。</li><li><strong>出栈操作</strong>：先取出 S.data[S.top] 中的元素，然后将 S.top 减少 1。</li></ul><p>【思考:如果一个栈的入栈序列为123，则出栈序列应该有多少种？ 】</p><p><img src="'+s+`" alt=""></p><p>解析：这种题大家最好在草稿纸上画一下，通过时操来总结规律，得出答案。题目中只指定了入栈顺序，没有指定出栈顺序，因此在入栈期间的任何时候都可以出栈，所以出栈的序列一共有5种，123、132、213、231、321</p><h2 id="栈的应用" tabindex="-1">栈的应用 <a class="header-anchor" href="#栈的应用" aria-label="Permalink to &quot;栈的应用&quot;">​</a></h2><h3 id="数制转换" tabindex="-1">数制转换 <a class="header-anchor" href="#数制转换" aria-label="Permalink to &quot;数制转换&quot;">​</a></h3><p>将一个数从一种进制转换为另一种进制时，可以使用栈来存储中间结果。例如，将十进制数转换为二进制数时，每次取余数并将其压入栈中，最后依次弹出栈中的元素即可得到转换后的结果。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import java.util.Stack;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class DecimalToBinary {</span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        int decimalNumber = 10;</span></span>
<span class="line"><span>        String binaryNumber = convertToBinary(decimalNumber);</span></span>
<span class="line"><span>        System.out.println(&quot;十进制数 &quot; + decimalNumber + &quot; 转换为二进制数是: &quot; + binaryNumber);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static String convertToBinary(int decimal) {</span></span>
<span class="line"><span>        // 创建一个栈来存储余数</span></span>
<span class="line"><span>        Stack stack = new Stack&lt;&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 当十进制数大于 0 时，进行除 2 取余操作，并将余数压入栈中</span></span>
<span class="line"><span>        while (decimal &gt; 0) {</span></span>
<span class="line"><span>            int remainder = decimal % 2;</span></span>
<span class="line"><span>            stack.push(remainder);</span></span>
<span class="line"><span>            decimal = decimal / 2;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 从栈中弹出元素并拼接成二进制字符串</span></span>
<span class="line"><span>        StringBuilder binary = new StringBuilder();</span></span>
<span class="line"><span>        while (!stack.isEmpty()) {</span></span>
<span class="line"><span>            binary.append(stack.pop());</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 如果二进制字符串为空，说明输入的十进制数是 0，直接返回 &quot;0&quot;</span></span>
<span class="line"><span>        return binary.length() == 0 ? &quot;0&quot; : binary.toString();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="括号匹配检验" tabindex="-1">括号匹配检验 <a class="header-anchor" href="#括号匹配检验" aria-label="Permalink to &quot;括号匹配检验&quot;">​</a></h3><p>检查字符串中的括号是否匹配，可以通过栈来实现,每当遇到左括号时将其压入栈中，遇到右括号时检查栈顶元素是否为对应的左括号，如果是则弹出栈顶元素，否则匹配失败。</p><p><img src="`+o+`" alt=""></p><p>Java代码实现括号匹配：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import java.util.Stack;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class BracketMatching {</span></span>
<span class="line"><span>    public static boolean isMatching(String str) {</span></span>
<span class="line"><span>        // 创建一个栈用于存储左括号</span></span>
<span class="line"><span>        Stack stack = new Stack&lt;&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 遍历输入字符串中的每个字符</span></span>
<span class="line"><span>        for (int i = 0; i &lt; str.length(); i++) {</span></span>
<span class="line"><span>            char ch = str.charAt(i);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            // 如果是左括号，将其压入栈中</span></span>
<span class="line"><span>            if (ch == &#39;(&#39; || ch == &#39;[&#39; || ch == &#39;{&#39;) {</span></span>
<span class="line"><span>                stack.push(ch);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            // 如果是右括号</span></span>
<span class="line"><span>            else if (ch == &#39;)&#39; || ch == &#39;]&#39; || ch == &#39;}&#39;) {</span></span>
<span class="line"><span>                // 如果栈为空，说明没有对应的左括号，返回 false</span></span>
<span class="line"><span>                if (stack.isEmpty()) {</span></span>
<span class="line"><span>                    return false;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                // 弹出栈顶元素</span></span>
<span class="line"><span>                char top = stack.pop();</span></span>
<span class="line"><span>                // 检查栈顶左括号和当前右括号是否匹配</span></span>
<span class="line"><span>                if ((ch == &#39;)&#39; &amp;&amp; top != &#39;(&#39;) ||</span></span>
<span class="line"><span>                    (ch == &#39;]&#39; &amp;&amp; top != &#39;[&#39;) ||</span></span>
<span class="line"><span>                    (ch == &#39;}&#39; &amp;&amp; top != &#39;{&#39;)) {</span></span>
<span class="line"><span>                    return false;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 遍历结束后，如果栈为空，说明所有括号都匹配成功</span></span>
<span class="line"><span>        return stack.isEmpty();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        String test1 = &quot;{[()]}&quot;;</span></span>
<span class="line"><span>        String test2 = &quot;{[(])}&quot;;</span></span>
<span class="line"><span>        String test3 = &quot;{[(&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        System.out.println(isMatching(test1)); // 输出: true</span></span>
<span class="line"><span>        System.out.println(isMatching(test2)); // 输出: false</span></span>
<span class="line"><span>        System.out.println(isMatching(test3)); // 输出: false</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="行编辑程序" tabindex="-1">行编辑程序 <a class="header-anchor" href="#行编辑程序" aria-label="Permalink to &quot;行编辑程序&quot;">​</a></h3><p>在日常的文本编辑过程中，用户难免会出现输入错误或者想要修改之前输入内容的情况，这种错误几乎是无可避免的。因此当字符输入后不应该直接写入存储区，这样容易造成磁盘IO浪费，而是应该先写入缓存，当用户输入完一定量的字符之后再刷入存储区。</p><p>序利用栈的后进先出特性，能够方便地实现撤销功能。例如，在一个简单的文本编辑器里，用户输入了一行文字 “I like apples”，之后发现 “apples” 输入有误，按下退格键（对应程序中的 # 字符），行编辑程序就会从栈中弹出最后一个字符，逐步撤销错误输入，将内容变为 “I like apple” 。</p><p>当用户想要完全清除当前正在编辑的一行内容时，就可以使用类似行编辑程序中 @ 字符的功能。比如在编辑一篇文章时，用户发现某一行内容完全错误或者不需要了，按下特定快捷键触发清空操作，程序会快速清空栈中的所有字符，让用户可以重新开始输入。</p><p>在这个过程中，栈是一个非常合适的数据结构，因为它的后进先出（LIFO）特性可以很好地处理撤销操作。</p><h3 id="表达式求值" tabindex="-1">表达式求值 <a class="header-anchor" href="#表达式求值" aria-label="Permalink to &quot;表达式求值&quot;">​</a></h3><p>计算中缀、前缀、后缀表达式的值时，栈是一个非常有用的工具，例如，中缀表达式可以先转换为后缀表达式，然后使用栈进行求值。</p><h1 id="栈和队列的java代码实现-了解" tabindex="-1">栈和队列的Java代码实现（了解） <a class="header-anchor" href="#栈和队列的java代码实现-了解" aria-label="Permalink to &quot;栈和队列的Java代码实现（了解）&quot;">​</a></h1><h2 id="栈的实现" tabindex="-1">栈的实现 <a class="header-anchor" href="#栈的实现" aria-label="Permalink to &quot;栈的实现&quot;">​</a></h2><h3 id="基于数组的栈" tabindex="-1">基于数组的栈 <a class="header-anchor" href="#基于数组的栈" aria-label="Permalink to &quot;基于数组的栈&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ArrayStack {</span></span>
<span class="line"><span>    private int[] data;</span></span>
<span class="line"><span>    private int top;</span></span>
<span class="line"><span>    private int capacity;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public ArrayStack(int capacity) {</span></span>
<span class="line"><span>        this.capacity = capacity;</span></span>
<span class="line"><span>        this.data = new int[capacity];</span></span>
<span class="line"><span>        this.top = -1;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public boolean isFull() {</span></span>
<span class="line"><span>        return top == capacity - 1;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public boolean isEmpty() {</span></span>
<span class="line"><span>        return top == -1;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void push(int value) {</span></span>
<span class="line"><span>        if (isFull()) {</span></span>
<span class="line"><span>            throw new RuntimeException(&quot;Stack is full&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        data[++top] = value;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public int pop() {</span></span>
<span class="line"><span>        if (isEmpty()) {</span></span>
<span class="line"><span>            throw new RuntimeException(&quot;Stack is empty&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return data[top--];</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public int peek() {</span></span>
<span class="line"><span>        if (isEmpty()) {</span></span>
<span class="line"><span>            throw new RuntimeException(&quot;Stack is empty&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return data[top];</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="基于链表的栈" tabindex="-1">基于链表的栈 <a class="header-anchor" href="#基于链表的栈" aria-label="Permalink to &quot;基于链表的栈&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class LinkedListStack {</span></span>
<span class="line"><span>    private Node top;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private static class Node {</span></span>
<span class="line"><span>        int value;</span></span>
<span class="line"><span>        Node next;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Node(int value) {</span></span>
<span class="line"><span>            this.value = value;</span></span>
<span class="line"><span>            this.next = null;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public boolean isEmpty() {</span></span>
<span class="line"><span>        return top == null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void push(int value) {</span></span>
<span class="line"><span>        Node newNode = new Node(value);</span></span>
<span class="line"><span>        newNode.next = top;</span></span>
<span class="line"><span>        top = newNode;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public int pop() {</span></span>
<span class="line"><span>        if (isEmpty()) {</span></span>
<span class="line"><span>            throw new RuntimeException(&quot;Stack is empty&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        int value = top.value;</span></span>
<span class="line"><span>        top = top.next;</span></span>
<span class="line"><span>        return value;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public int peek() {</span></span>
<span class="line"><span>        if (isEmpty()) {</span></span>
<span class="line"><span>            throw new RuntimeException(&quot;Stack is empty&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return top.value;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="队列的实现" tabindex="-1">队列的实现 <a class="header-anchor" href="#队列的实现" aria-label="Permalink to &quot;队列的实现&quot;">​</a></h2><h3 id="基于数组的队列" tabindex="-1">基于数组的队列 <a class="header-anchor" href="#基于数组的队列" aria-label="Permalink to &quot;基于数组的队列&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ArrayQueue {</span></span>
<span class="line"><span>    private int[] data;</span></span>
<span class="line"><span>    private int front;</span></span>
<span class="line"><span>    private int rear;</span></span>
<span class="line"><span>    private int size;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public ArrayQueue(int capacity) {</span></span>
<span class="line"><span>        this.data = new int[capacity];</span></span>
<span class="line"><span>        this.front = 0;</span></span>
<span class="line"><span>        this.rear = -1;</span></span>
<span class="line"><span>        this.size = 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public boolean isFull() {</span></span>
<span class="line"><span>        return size == data.length;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public boolean isEmpty() {</span></span>
<span class="line"><span>        return size == 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void enqueue(int value) {</span></span>
<span class="line"><span>        if (isFull()) {</span></span>
<span class="line"><span>            throw new RuntimeException(&quot;Queue is full&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        rear = (rear + 1) % data.length;</span></span>
<span class="line"><span>        data[rear] = value;</span></span>
<span class="line"><span>        size++;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public int dequeue() {</span></span>
<span class="line"><span>        if (isEmpty()) {</span></span>
<span class="line"><span>            throw new RuntimeException(&quot;Queue is empty&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        int value = data[front];</span></span>
<span class="line"><span>        front = (front + 1) % data.length;</span></span>
<span class="line"><span>        size--;</span></span>
<span class="line"><span>        return value;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public int peek() {</span></span>
<span class="line"><span>        if (isEmpty()) {</span></span>
<span class="line"><span>            throw new RuntimeException(&quot;Queue is empty&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return data[front];</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="基于链表的队列" tabindex="-1">基于链表的队列 <a class="header-anchor" href="#基于链表的队列" aria-label="Permalink to &quot;基于链表的队列&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class LinkedListQueue {</span></span>
<span class="line"><span>    private Node head;</span></span>
<span class="line"><span>    private Node tail;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private static class Node {</span></span>
<span class="line"><span>        int value;</span></span>
<span class="line"><span>        Node next;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Node(int value) {</span></span>
<span class="line"><span>            this.value = value;</span></span>
<span class="line"><span>            this.next = null;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public boolean isEmpty() {</span></span>
<span class="line"><span>        return head == null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void enqueue(int value) {</span></span>
<span class="line"><span>        Node newNode = new Node(value);</span></span>
<span class="line"><span>        if (isEmpty()) {</span></span>
<span class="line"><span>            head = tail = newNode;</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            tail.next = newNode;</span></span>
<span class="line"><span>            tail = newNode;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public int dequeue() {</span></span>
<span class="line"><span>        if (isEmpty()) {</span></span>
<span class="line"><span>            throw new RuntimeException(&quot;Queue is empty&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        int value = head.value;</span></span>
<span class="line"><span>        head = head.next;</span></span>
<span class="line"><span>        if (head == null) {</span></span>
<span class="line"><span>            tail = null;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return value;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public int peek() {</span></span>
<span class="line"><span>        if (isEmpty()) {</span></span>
<span class="line"><span>            throw new RuntimeException(&quot;Queue is empty&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return head.value;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>以上代码分别实现了基于数组和链表的栈和队列，并提供了基本的操作方法。你可以根据具体需求选择合适的数据结构实现。</p><h1 id="真题练习" tabindex="-1">真题练习 <a class="header-anchor" href="#真题练习" aria-label="Permalink to &quot;真题练习&quot;">​</a></h1><table tabindex="0"><thead><tr><th>【国家电网（2021）】若进栈的顺序是1，2，3，4，进栈和出栈的操作可以穿插执行，那么不可能出现的出栈序列是？A. 1，2，3，4B. 2，3，4，1C. 3，1，4，2D. 3，4，2，1答案：C解析：栈的特点是先进后出，对于C来说第一个出栈的是3，那么1肯定比2先入栈，所以2肯定比1先出栈，而答案中1比2先出栈，因此是错误的。</th></tr></thead></table><table tabindex="0"><thead><tr><th>【国家电网（2021）】设计一个判别表达式中左右括号是否配对的算法，采用()数据结构最佳A.顺序表B.栈C.队列D.链表答案：B解析：括号配对的核心逻辑是 “左括号入栈，右括号与栈顶左括号匹配并出栈”，最终栈空则配对成功。栈的 “先进后出” 特性完美适配这种 “嵌套匹配” 场景，而顺序表、队列、链表无法高效实现此类逻辑，故最佳选择为栈。</th></tr></thead></table><table tabindex="0"><thead><tr><th>【南方电网（2021）】为支持函数调用及返回，常采用称为“()”的数据结构A队列B.栈C.多维数组D顺序长答案：B解析：函数调用时，需保存当前调用状态（如返回地址、局部变量），后续嵌套调用时新状态压栈；函数返回时，按 “最后调用的函数先返回” 的顺序弹出栈顶状态，符合栈 “先进后出” 的特性。队列（先进先出）、数组、顺序表均不适合该场景。</th></tr></thead></table><table tabindex="0"><thead><tr><th>【南方电网（2020）】栈和队列的共同特点是().A. 只允许在端点处插人和删除元素B. 都是先进后出C. 都是先进先出D. 没有共同点答案：A解析：栈仅允许在栈顶（一端）执行插入（push）和删除（pop）；队列仅允许在队尾（一端）插入、队头（另一端）删除；二者共同特点是 “只允许在端点处操作”。B（先进后出）是栈的特性，C（先进先出）是队列的特性，D 错误。</th></tr></thead></table><table tabindex="0"><thead><tr><th>【国家电网（2019）】队列是一种()的线性表A.先进先出B.先进后出C.只能插人D.只能删除答案：A解析：队列的核心特性是 “先进先出”（FIFO），即先进入队列的元素先被取出。B 是栈的特性，C、D 描述片面（队列允许插入和删除，只是位置固定）。</th></tr></thead></table><p>| 【中国铁塔（2019）】元素3、1、2一次全部进入一个栈陆陆续续出操作，得到的很出栈序列为(). A 321 B.312 C.123 D.213 答案：D</p><table tabindex="0"><thead><tr><th>解析：元素入栈顺序为 3→1→2（栈内顺序：3 在底，1 中间，2 在顶）。“陆续出栈” 指可在入栈过程中出栈，但需遵循 “栈顶先出”：若全部入栈后再出栈：栈顶为 2，依次出栈 2→1→3，即序列 213（D）。其他选项分析：A（321）：3 出栈后，栈内剩 1 和 2（1 在底），需先出 2 再出 1，逻辑可行，但题目中 “一次全部进入” 更倾向 “全部入栈后出栈”，故不优先；B（312）、C（123）需在入栈过程中提前出栈，不符合 “一次全部进入” 的场景。综上，最符合题意的是 D。</th></tr></thead></table>`,65)])])}const y=a(u,[["render",h]]);export{v as __pageData,y as default};
