<div class="container pt-5">
    <form id="apiCallForm" method="post" action="">
        <div class="form-group">
        <label>API link </label>
        <input type="text" class="form-control" id="inputURL" name="inputURL" placeholder="Enter API URL">
        <small id="emailHelp" class="form-text text-muted">Enter API call Link</small>
        <div class="text-center">
            <button type="submit" class="btn btn-primary">Submit</button>
        </div>
    </form>
</div>
<div class="container text-center">
        <form style="display:none" id="filterForm">
              
        </form>
        <div class="spinner-border" style="width: 3rem; height: 3rem;display:none;margin:0 auto;" role="status">
            <span class="sr-only">Loading...</span>
        </div>
    <div id="response">

    </div>
</div>
    