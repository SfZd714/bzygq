import{_ as a,o as i,c as n,a2 as p}from"./chunks/framework.F7eQ-ohH.js";const g=JSON.parse('{"title":"线性表的基础知识","description":"","frontmatter":{},"headers":[],"relativePath":"科技岗专业课/数据结构/2、线性表.md","filePath":"科技岗专业课/数据结构/2、线性表.md","lastUpdated":1788883925000}'),l={name:"科技岗专业课/数据结构/2、线性表.md"};function h(t,s,e,k,d,E){return i(),n("div",null,[...s[0]||(s[0]=[p(`<h1 id="线性表的基础知识" tabindex="-1">线性表的基础知识 <a class="header-anchor" href="#线性表的基础知识" aria-label="Permalink to &quot;线性表的基础知识&quot;">​</a></h1><h2 id="线性表的定义" tabindex="-1">线性表的定义 <a class="header-anchor" href="#线性表的定义" aria-label="Permalink to &quot;线性表的定义&quot;">​</a></h2><p>线性表是由相同类型的数据元素构成的有限序列，其元素数量称为线性表的长度，通常用n表示，其中n≥0，当n=0时，线性表为空表。</p><p>常见的线性表包括数组、链表、栈和队列，栈（Stack）和队列（Queue）都是线性表的一种特殊形式。线性表可以通过两种主要的方式表示：顺序表示和链式表示。</p><p>根据不同的存储结构，线性表可以实现为线性链表、循环链表、双向链表等，链表具体可以分为四种形式：单链表、双链表、循环单链表和循环双链表。</p><h2 id="线性表的特点" tabindex="-1">线性表的特点 <a class="header-anchor" href="#线性表的特点" aria-label="Permalink to &quot;线性表的特点&quot;">​</a></h2><ul><li><p>线性表中有且仅有一个开始元素（第一个元素）;</p></li><li><p>线性表中有且仅有一个结束元素（最后一个元素）;</p></li><li><p>除了最后一个元素之外，每个元素都有一个直接后继;</p></li><li><p>除了第一个元素之外，每个元素都有一个直接前驱;</p></li><li><p>线性表中每一个元素都具有相同的数据类型，且不能是子表；</p></li><li><p>线性表中每一个元素都有位置和值，位置也称为下标，决定了该元素在线性表中的位置、前驱、后驱逻辑关系；值是该元素的具体内容</p></li></ul><h1 id="顺序存储结构和相关操作" tabindex="-1">顺序存储结构和相关操作 <a class="header-anchor" href="#顺序存储结构和相关操作" aria-label="Permalink to &quot;顺序存储结构和相关操作&quot;">​</a></h1><h2 id="顺序存储结构-数组" tabindex="-1">顺序存储结构（数组） <a class="header-anchor" href="#顺序存储结构-数组" aria-label="Permalink to &quot;顺序存储结构（数组）&quot;">​</a></h2><p>顺序存储结构是指用一组地址连续的存储单元依次存储线性表中的各个元素，这种方式类似于数组的存储方式，每个元素占用一块固定的内存空间，通过元素的下标可以直接访问到相应的元素，其特点如下：</p><ul><li><p><strong>存储密度高</strong>，因为不需要额外的空间来表示元素之间的逻辑关系。</p></li><li><p><strong>支持随机访问，</strong> 即可以通过下标直接访问到任意位置的元素。</p></li><li><p><strong>插入和删除操作需要移动大量的元素，效率较低。</strong></p></li></ul><h2 id="顺序表元素存储地址计算" tabindex="-1">顺序表元素存储地址计算 <a class="header-anchor" href="#顺序表元素存储地址计算" aria-label="Permalink to &quot;顺序表元素存储地址计算&quot;">​</a></h2><p>顺序表在计算机内存当中的存储地址是连续的，因此可以通过头节点的内存地址加上下标来进行计算。假设顺序表中有n个元素，每个元素占有m个存储单元，第一个单元的存储地址为 ,则第i个元素的存储地址.</p><h2 id="顺序表的相关操作" tabindex="-1">顺序表的相关操作 <a class="header-anchor" href="#顺序表的相关操作" aria-label="Permalink to &quot;顺序表的相关操作&quot;">​</a></h2><p>1）初始化：分配一段连续的内存空间，设置线性表的初始状态。</p><div class="language-csharp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">csharp</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> SeqList</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    private</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> int</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[] </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">data</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    private</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> int</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> length</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    public</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> SeqList</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">int</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> capacity</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        this</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.data </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> int</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[capacity];</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        this</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.length </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    // 初始化顺序表</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> void</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> init</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        this</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.length </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>2）插入：在指定位置插入一个新元素，需要将该位置及其之后的所有元素向后移动一位。</p><div class="language-glsl vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">glsl</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">public boolean </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">insert</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">int</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;"> index</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">int</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;"> value</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (index  length </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">||</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> length </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> data.length) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        return</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> false</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> // 插入失败</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    for</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">int</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> i </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> length; i </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> index; i</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">--</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">        data</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[i] </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;"> data</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[i </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">];</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">    data</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[index] </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> value;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    length</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">++</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> // 插入成功</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>3）删除：删除指定位置的元素，需要将该位置之后的所有元素向前移动一位。</p><div class="language-glsl vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">glsl</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">public boolean </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">remove</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">int</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;"> index</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (index </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> length) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        return</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> false</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> // 删除失败</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    for</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">int</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> i </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> index; i </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> length) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        return</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> -</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> // 索引越界</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;"> data</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[index];</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> // 返回值</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>5）遍历：按照元素的物理顺序依次访问每一个元素。</p><div class="language-axapta vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">axapta</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int searchByValue(int value) {</span></span>
<span class="line"><span>    for (int i = 0; i = length) {</span></span>
<span class="line"><span>        return -1; // 索引越界</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return data[index]; // 返回值</span></span>
<span class="line"><span>}</span></span></code></pre></div><h1 id="链式存储结构和相关操作" tabindex="-1">链式存储结构和相关操作 <a class="header-anchor" href="#链式存储结构和相关操作" aria-label="Permalink to &quot;链式存储结构和相关操作&quot;">​</a></h1><h2 id="链式存储结构-链表" tabindex="-1">链式存储结构（链表） <a class="header-anchor" href="#链式存储结构-链表" aria-label="Permalink to &quot;链式存储结构（链表）&quot;">​</a></h2><p>链式存储结构是指用一组任意的存储单元存储线性表中的各个元素。每个元素除了包含自身的数据信息外，还包含指向其后继元素的指针。这种结构通常用于实现单链表、双链表等，其特点如下：</p><ul><li><p><strong>不需要连续的存储空间</strong>，因此更容易管理存储空间；</p></li><li><p><strong>插入和删除操作相对简单</strong>，只需要修改相关节点的指针即可；</p></li><li><p><strong>不能随机访问</strong>，必须从头节点开始逐个访问直到目标节点；</p></li></ul><h2 id="链表的相关操作" tabindex="-1">链表的相关操作 <a class="header-anchor" href="#链表的相关操作" aria-label="Permalink to &quot;链表的相关操作&quot;">​</a></h2><ol><li>初始化：创建一个空的链表，通常设置一个头指针指向链表的第一个节点。</li></ol><div class="language-kotlin vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">kotlin</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Node</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    int </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">data</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Node next;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    public</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Node</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(int </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">data</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        this</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">data</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> data</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        this</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.next </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> null</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> LinkedList</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    private</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Node head;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    public</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> LinkedList</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        this</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.head </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> null</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    // 初始化链表</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    public</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> void </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">init</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        this</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.head </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> null</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><ol start="2"><li>插入：在指定位置插入一个新节点，需要调整前驱节点和新节点的指针。</li></ol><div class="language-axapta vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">axapta</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public boolean insert(int position, int value) {</span></span>
<span class="line"><span>    Node newNode = new Node(value);</span></span>
<span class="line"><span>    if (position == 0) {</span></span>
<span class="line"><span>        newNode.next = head;</span></span>
<span class="line"><span>        head = newNode;</span></span>
<span class="line"><span>        return true; // 插入成功</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    Node current = head;</span></span>
<span class="line"><span>    for (int i = 0; current != null &amp;&amp; i next == head</span></span>
<span class="line"><span>B．p-&gt;next == NULL</span></span>
<span class="line"><span>C．p == head</span></span>
<span class="line"><span>D．p-&gt;prior == head答案 ：A</span></span>
<span class="line"><span></span></span>
<span class="line"><span>解析：单向循环链表的尾结点的next指针指向头结点（head），因此p-&gt;next == head时p为尾结点。】</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 考点速记——线性表 央国企笔试考点速记</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 线性表基础核心</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1.  定义：相同类型数据元素的有限序列（n≥0，n=0为空表），含数组、链表、栈、队列（栈/队是特殊线性表）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>2.  核心特点：有唯一首尾元素，除首尾外元素有唯一前驱和后继，元素类型一致</span></span>
<span class="line"><span></span></span>
<span class="line"><span>3.  存储形式：顺序存储（数组）、链式存储（单/双/循环链表等）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 顺序表（数组）核心考点</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1.  核心特性：逻辑相邻→物理必相邻，支持随机访问（下标直接访问，O(1)）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>2.  地址计算：Loc(ai) = Loc(a1) + (i-1)×m（m为单个元素占用存储单元）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>3.  操作关键：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>-   插入：第i位插入，移动元素个数 = n - i + 1（i从0/1开始均适用，按题干下标规则）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>-   删除：第i位删除，移动元素个数 = n - i</span></span>
<span class="line"><span></span></span>
<span class="line"><span>-   平均移动次数：插入/删除均为 n/2（等概率插入）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1.  优缺点：存储密度高、查快；增删慢（需移元素）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 链表核心考点</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1.  核心特性：存储不连续（可连续可离散），不可随机访问（需遍历，O(n)）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>2.  操作关键：增删仅改指针，无需移动结点（效率高，O(1)，查找后）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>3.  地址特点：物理地址可连续或不连续，由指针关联逻辑关系</span></span>
<span class="line"><span></span></span>
<span class="line"><span>4.  高频判断：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>-   随机访问：仅顺序表支持，链表不支持</span></span>
<span class="line"><span></span></span>
<span class="line"><span>-   存储连续：顺序表必连续，链表不一定</span></span>
<span class="line"><span></span></span>
<span class="line"><span>-   增删效率：链表＞顺序表（无需移元素）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 链表分类核心要点</span></span>
<span class="line"><span></span></span>
<span class="line"><span>| 类型 | 核心特征 | 常考考点 |</span></span>
<span class="line"><span>| --- | --- | --- |</span></span>
<span class="line"><span>| 单链表 | 仅含next指针，只能单向遍历 | 插入/删除需找前驱节点 |</span></span>
<span class="line"><span>| 双链表 | 含prev+next指针，可双向遍历 | 适配前进/后退场景（浏览器历史） |</span></span>
<span class="line"><span>| 单向循环链表 | 尾结点next指向头节点（head） | 尾结点判断：p-&gt;next == head |</span></span>
<span class="line"><span>| 循环双链表 | 尾结点next=head，头节点prev=尾结点 | 双向遍历+循环特性 |</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 高频真题必记</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1.  循环链表尾结点判断（单向）：p-&gt;next == head（非NULL，NULL是单链表尾结点）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>2.  可随机访问的线性表：仅顺序表（链表需遍历）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>3.  顺序表核心特性：逻辑相邻→物理相邻</span></span>
<span class="line"><span></span></span>
<span class="line"><span>4.  链表最突出优势：插入/删除无需移动结点</span></span>
<span class="line"><span></span></span>
<span class="line"><span>5.  顺序表插入移动次数：n-i+1（第i位前插入），平均n/2</span></span></code></pre></div>`,31)])])}const c=a(l,[["render",h]]);export{g as __pageData,c as default};
